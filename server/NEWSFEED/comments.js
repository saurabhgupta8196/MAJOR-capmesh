
const express = require('express');
const app = express();

const Dao = require('../modules/data-access/data-access');
const dao = new Dao();

class Comments {

    /*******************
     * @Description retrives particular comments of the post based on postId
     * @author Dnyanda Deshpande, A Haritha, Aditya Gupta
     * @params {database collection} collections
     * @params {integer} id
     * @params {object} result array of comments based on postId
     */
    async getComments(collections, id) {
        console.log(id)
        let query = [{ $project: { "posts.postid": 1, "posts.comments": 1 } }, { $unwind: "$posts" }, { $match: { "posts.postid": id } }]
        let result = await dao.aggregate(collections, query);
        console.log(result);
        //arr1.push(result);
        let count = result[0].posts.comments.length;
        result.push({ "count": count })

        //console.log(result[1].count);
        return (result);

    }

    /*******************
     * @Description adds particular comments of the post based on postId and userId
     * @author Dnyanda Deshpande, A Haritha, Aditya Gupta, Pawan Parihar
     * @params {database collection} collections
     * @params {integer} u
     * @params {integer} p
     * @params {Object} req
     * @params {object} result adds data in comments array based on postId and userId
     */

    async postComments(collections, uId, pId, requestBody) {
        let query = { $and: [{ "userName": uId }, { "posts.postid": pId }] };

        let newquery = { $push: { "posts.$.comments": { "commentBy": requestBody.commentBy, "content": requestBody.content, "timestamp": new Date() } } }
        let result = await dao.update("newsFeed", query, newquery);
        return (result)
    }
}

module.exports = Comments;
