import fs from 'fs';

export const getDb = () => {
    const fileContent = fs.readFileSync("db.json", { encoding: "utf-8" })
    return JSON.parse(fileContent);
};

export const saveDb = (db) => {
    fs.writeFileSync("./db.json", JSON.stringify(db));
};