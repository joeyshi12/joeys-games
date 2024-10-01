package handlers

import (
	"log"
	"net/http"
	"strings"
	"text/template"
)

func IndexPageHandler(templatePath string) http.Handler {
    return http.HandlerFunc(func (w http.ResponseWriter, r *http.Request) {
        if r.Method != "GET" || strings.Trim(r.URL.Path, "/") != "" {
            notFoundTemplate := template.Must(template.ParseFiles("templates/404.html", "templates/base.html"))
            notFoundTemplate.Execute(w, nil)
            return
        }
        indexTemplate := template.Must(template.ParseFiles(templatePath, "templates/base.html"))
        indexTemplate.Execute(w, nil)
    })
}

func LoggingHandler(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        log.Printf("%s %s", r.Method, r.URL.Path)
        next.ServeHTTP(w, r)
    })
}
