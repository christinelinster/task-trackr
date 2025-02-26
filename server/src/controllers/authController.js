import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../config/database.js"

let refreshTokens = [];

function generateAccessToken(user){
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '10m'})
  }

export async function register(req,res) {
    const saltRounds = 10;
    const { username, password } = req.body;

    try{
        const hash = await bcrypt.hash(password, saltRounds);
        const result = await pool.query(
            "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *", 
            [username, hash]
        )

        res.json(result.rows[0])

    } catch(err){
        console.error("Register error:", err);
        res.status(500).json({error: "Internal Server Error"})
    }
}

export async function login(req, res) {
    const { username, password } = req.body;
    try {
      const result = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
      if (result.rowCount === 0) return res.status(401).json({ error: "Invalid username" });
  
      const user = result.rows[0];
      if (await bcrypt.compare(password, user.password)) {
        const accessToken = generateAccessToken({ user: user.username });
        const refreshToken = jwt.sign({ user: user.username }, process.env.REFRESH_TOKEN_SECRET);
        refreshTokens.push(refreshToken);
        res.json({ accessToken, refreshToken });
      } else {
        res.sendStatus(403);
      }
    } catch (err) {
      console.error("Login error:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  export function logout(req, res) {
    refreshTokens = refreshTokens.filter(token => token !== req.body.token);
    res.sendStatus(204);
  }

  export function refreshToken(req, res) {
    const refreshToken = req.body.token;
    if (!refreshToken) return res.sendStatus(401);
    if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);
  
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
      const accessToken = generateAccessToken({ user: user.username });
      res.json({ accessToken });
    });
  }