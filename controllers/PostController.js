import PostModel from "../models/Post.js";


export const getAll = async (req, res) => {
    try {
        const posts = await PostModel.find().populate('user').exec();
        res.json(posts);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Failed got posts'
        });
    }
};
export const getOne = (req, res) => {
    try {
        const postId = req.params.id;
        PostModel.findOneAndUpdate(
            {
                _id: postId
            },
            {
                $inc: { viewCount: 1 }
            },
            {
                returnDocument: 'after'
            }).then(doc => {
                try {
                    if (!doc) {
                        return res.status(105).json({
                            message: 'Net docov sosi hui'
                        })
                    };
                    res.json(doc);
                } catch (err) {
                    console.log(err)
                    res.stetus(401).json({
                        message: 'Prideca sasat'
                    })
                }
            })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Failed got post suka'
        });
    }
};
export const createPost = async (req, res) => {
    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            tags: req.body.tags,
            imageUrl: req.body.imageUrl,
            user: req.userId
        });
        const post = await doc.save();
        res.json(post);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Failed to set post'
        });
    }
};
export const removePost = (req, res) => {
    try {
        const postId = req.params.id;
        PostModel.findOneAndDelete({
            _id: postId
        }).then(doc => {
            try {
                if (!doc) {
                    return res.status(105).json({
                        message: 'Стаья не нашлась'
                    })
                };
                res.json({
                    success: true
                });
            } catch (error) {
                console.log(error);
                res.status(101).json({
                    message: 'Статья не удалилась'
                })
            }
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Failed delete'
        })
    }
};
export const updatePost = async (req, res) => {
    try {
        const postId = req.params.id;
        await PostModel.updateOne(
            {
                _id: postId
            },
            {
                title: req.body.title,
                text: req.body.text,
                tags: req.body.tags,
                imageUrl: req.body.imageUrl,
                user: req.userId
            }
        );
        res.json({
            success: true
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Не удалось обновить статью'
        })
    }
};