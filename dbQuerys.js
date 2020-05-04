const updateAndFetch = 'update sentences set assign = true where "sentenceId" in (select "sentenceId" from sentences where assign = false limit 10) returning *;'


module.exports = {
    updateAndFetch
} 