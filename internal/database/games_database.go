package database

import (
	"database/sql"
	"fmt"
	"os"
)

func OpenGamesDatabase() (*sql.DB, error) {
    dataSourceName := fmt.Sprintf("%s:%s@/%s", os.Getenv("DB_USER"), os.Getenv("DB_PASS"), os.Getenv("DB_NAME"))
    return sql.Open("mysql", dataSourceName)
}
