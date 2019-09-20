module.exports = retry = async (fn, max_retries, retry_interval) => {
    try {
        console.log(`Trying. Remaining attempts : ${max_retries}`);
        return await fn();
    } catch (e) {
        if(max_retries <= 0) {
            console.log('Retry limit reached. Aborting');
            throw e;
        }
        console.log(e);
        await new Promise(resolve => setTimeout(resolve, retry_interval));
        return retry(fn, max_retries-1, retry_interval);
    }
};