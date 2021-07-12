const btnGenerate = document.getElementById("btnGenerate");
btnGenerate.addEventListener("click", () => {
    let inpUrl = document.getElementById("inpUrl").value;
    let outUrl = document.getElementById("outUrl");

    generateUrl(inpUrl)
    .then((result) => {
        outUrl.href = `localhost:3000/url/${result.id}`;
        outUrl.innerHTML = `localhost:3000/url/${result.id}`;
    })
    .catch(err => console.log(err));
});

const generateUrl = async (url) => {
    // Call the "generate" route as POST request. Send the long URL as JSON to the server.
    const response = await fetch(`/generate`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({url: url}),
    });
    return await response.json();
}