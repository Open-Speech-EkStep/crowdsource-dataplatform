const updateAndFetch = 'update sentences set assign = true where "sentenceID" in (select "sentenceID" from sentences where assign = false limit 10) returning *;'


module.exports = {
    updateAndFetch
} 