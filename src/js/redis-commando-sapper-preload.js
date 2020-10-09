export default (fetch, preloadReq) => {
    return fetch('/rcommando', {
        method: 'POST',
        body: JSON.stringify(preloadReq),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(rsp => rsp.json())
    .then(data => ({
        types: preloadReq.map(req => typeof req === "object" ? req.type : req),
        data: data
    }));
    // .then(res => {
    //     console.log("Preloaded result", res);
    //     return res;
    // });
}
