const response = {
    success(data, message){
        return {
            Data: data,
            RespCode: 'SUCCESS',
            RespMessage: message
        };
    },

    error(err){
        return {
            Data: err,
            RespCode: 'ERROR',
            RespMessage: err.message
        };
    }
};

module.exports = response;
