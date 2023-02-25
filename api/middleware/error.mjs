export const serverErrorHandler = (err, req, res) => {
    res.status(500).send(err);
};