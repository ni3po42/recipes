export const serverErrorHandler = (err, req, res) => {
    console.log(err);
    res.status(500).send(err);
};