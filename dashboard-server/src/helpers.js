module.exports = {
    failResponse: (title, status) => {
        return {
            errors: [
                {
                    status,
                    title
                }
            ]
        }

    }
}