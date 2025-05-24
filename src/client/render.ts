import * as fs from "fs";
const nunjucks = require("nunjucks");

nunjucks.configure("views", {autoescape: true});

const WEB_PATH = "../../public/web";

interface RenderTarget {
    /**
     * Path to write rendered HTML relative to the web folder.
     */
    targetPath: string;
    /**
     * Path to read templates relative to the views folder.
     */
    templatePath: string;
    /**
     * Values for rendering the template.
     */
    props: object;
}

const targets: RenderTarget[] = [
    {
        targetPath: "index.html",
        templatePath: "index.html",
        props: {title: "Joey's Games"}
    },
    {
        targetPath: "snake/index.html",
        templatePath: "snake.html",
        props: {title: "Snake"}
    },
    {
        targetPath: "platform-party/index.html",
        templatePath: "platform_party.html",
        props: {title: "Platform Party"}
    },
    {
        targetPath: "404.html",
        templatePath: "404.html",
        props: {title: "Page Not Found | Joey's Games"}
    }
];

for (let { targetPath, templatePath, props } of targets) {
    const renderedContent = nunjucks.render(templatePath, props);
    const parts = targetPath.split("/");
    if (parts.length > 1) {
        parts.pop()
        const directoryPath = `${WEB_PATH}/${parts.join("/")}`;
        fs.mkdirSync(directoryPath, {recursive: true});
    }
    fs.writeFile(`${WEB_PATH}/${targetPath}`, renderedContent, (err) => {
        if (err) {
            console.error(`Failed to write ${templatePath}`, err);
        } else {
            console.log(`Rendered ${templatePath}`);
        }
    });
}

