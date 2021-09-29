import express, { Request, Response, text } from "express";


const getRandomArticle = require("get-random-article")
const option = {language: 'cz'}
const app: express.Application = express();
const PORT: number = 3103;
const SERVER: string = "http://localhost";
const banwords: string[] = [
    "of", "working", "johncommons", "commons", "viz", "legal", "college", "http", "de", "georges", "et",
    "fr", "thumb"
]


function getText(text: string) {
    return text.replace(/[\[\]\{\}\|\=\"\*\d\-\.\'\,\!\%\(\)\:\–\+\/\守\_\„\“]/g, " ")
            .replace(/<[^>]*>/g, " ")
            .replace(/www/g, " ")
            .replace(/^http?:\/\/.*[\r\n]*/g, " ")
            .replace(/\s+/g,' ')
            .trim() 
}

function redizer(text: string) {
    let output = text.split(" ").filter((word, i) => {
            if (word.match(/[\?\&\#]/g))
                return false;
            if (word.toUpperCase() == word) return false;
            if (banwords.includes(word.toLowerCase())) return false;
            return true;
        })
    return output
}

function randomzier(texts: string[]) {
    let output: string = "";
    let index = 0;
    for (let j = 0; j < 10; j++) {
        for (let i = 0; i < 4; i++) {
            for (let k = 0; k < 4; k++) {
                index = Math.floor(Math.random() * texts.length);
                output += texts[index]+" ";
                if (texts.length <= 1) return output.trim();
                texts.splice(index, 1)
            }
            output += ',<br>';
        }
        output += '<br>';
    }
    return output.trim();
}


app.set("view engine", "ejs");

app.get("/", (req: Request, res: Response) => {
    getRandomArticle(option, (e: Error, text: string) => {
        if (e) console.log(e);
        res.render("index", {
            text: randomzier(redizer(getText(text)))
        })
    })
})


app.listen(PORT, () => {
    console.log(`listenning on ${SERVER}:${PORT}`);
})