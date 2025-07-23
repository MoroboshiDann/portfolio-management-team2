const getData = (req, res) =>  {
    res.status(200).json({
        message : "Data fetched successfully!"
    });
};

const postData = (req, res) => {
    res.status(201).json({
        message : "data posted successfully!"
    });
};
