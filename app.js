const express = require("express");
const app = express();
const port = 3000;
const path = require("path");
const pool = require("./db");

// Set the static directory to "public" and the name to "static". Files in the "public"
// directory can be served by "/static/css/style.css" as example.
app.use("/static", express.static(path.join(__dirname, "public")));

// Used for handling promises
app.use(express.json());

// Set view engine to "handlebars".
app.set("view engine", "hbs");

// Render the "index.hbs" as main page.
app.get("/", (req, res) => {
    res.render("index");
});

/*
    TODO:
    Generate ID recursive -> generate ids until not in database
*/
app.post("/generate", async (req, res) => {
    const url = req.body.url;

    let con;
    try {
        // Connect to db.
        con = await pool.getConnection();

        // Check if URL is already saved in db.
        let query = `select * from urls WHERE longUrl = '${url}'`;
        let rows = await con.query(query);
        
        if(rows.length > 0) {
            // Return the id of the existing url.
            res.send({"id": rows[0]["id"]});
        }
        else {
            // Generate id and save to database.
            let id = generateId(3);

            // Check if the id is already in the db.
            let query = `SELECT id FROM urls WHERE id = '${id}'`;
            let rows = await con.query(query);

            if(rows.length > 0) {
                // Generate new id if in db.
                id = generateId(3);   
            }

            // Save new data into db.
            let insert = "INSERT INTO urls VALUE (?, ?)";
            let tmp = await con.query(insert, [url, id]);
            console.log(tmp);

            // Send the id back to the client.
            res.send({"id": id});
        }

    }
    catch(err) {
        throw err;
    }
    finally {
        if(con) return con.release();
    }
});

app.get("/url/:id", async (req, res) => {
    let con;
    try {
        con = await pool.getConnection();
        let query = `select longUrl from urls WHERE id = '${req.params.id}'`;
        let rows = await con.query(query);

        if(rows.length > 0) {
            res.redirect(rows[0]["longUrl"]);
        }
    }
    catch(err) {
        throw err;
    }
    finally {
        if(con) return con.release();
    }

    res.send(req.params);
});

app.listen(port, () => {
    console.log(`Running at localhost:${port}`);
});

/**
 * Generate a random string with the given chars.
 * @param {*} length 
 * @returns String
 */
const generateId = (length) => {
    let result = "";
    let chars = "0123456789abcdef"
    for(let i = length; i > 0; --i) {
        result += chars[Math.round(Math.random() * (chars.length -1))];
    }
    return result;
}