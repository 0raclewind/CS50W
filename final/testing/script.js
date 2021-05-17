key = "5b5a9f1f4b08e4183144f47a363fb3465960a7b5";

document.addEventListener('DOMContentLoaded', () => {
    fetchHistory(1, "ETH");
    document.querySelector('#day').addEventListener('click', () => {
        fetchHistory(1, "ETH")
    });
    document.querySelector('#week').addEventListener('click', () => {
        fetchHistory(7, "ETH")
    });
    document.querySelector('#month').addEventListener('click', () => {
        fetchHistory(30, "ETH")
    });
});

// fetch(`https://api.nomics.com/v1/exchange-rates?key=${key}`)
//     .then(response => response.json())
//     .then(data => {
//         data.forEach(item => {
//             if (item["currency"] === "BTC") {
//                 document.querySelector("#currency").innerHTML = item["currency"];
//                 let price = Math.round(item["rate"] * 100) / 100
//                 document.querySelector("#price").innerHTML = price;
//             }
//         });
//     })

function fetchHistory(timeFrame, coin) {
    document.querySelector("h3 span").innerHTML = coin;

    path = "https://api.nomics.com/v1/exchange-rates/history";
    start = dateCalc(timeFrame);

    url = `${path}?key=${key}&currency=${coin}&start=${start}`;

    document.querySelectorAll("table tr").forEach(row => {
        if (row.id != "tableHead") {
            row.remove();
        }
    });

    let labels = [];
    let data = [];

    fetch(url)
        .then(response => response.json())
        .then(json => {
            json.forEach(item => {
                let dateString = item["timestamp"].split("T");
                let priceFloat = Math.round(parseFloat(item["rate"]) * 100) / 100;


                if (timeFrame > 1) {
                    labels.push(dateString[0]);
                } else {
                    labels.push(dateString[1].substring(0, 5));
                }
                data.push(priceFloat);
                // let table = document.querySelector("table");
                // let tr = document.createElement("tr");
                // let date = document.createElement("td");
                // let time = document.createElement("td");
                // let price = document.createElement("td");


                // date.innerHTML = dateString[0];
                // time.innerHTML = dateString[1].substring(0, 5);
                // price.innerHTML = `$${priceFloat}`;

                // tr.appendChild(date);
                // tr.appendChild(time);
                // tr.appendChild(price);

                // table.appendChild(tr);
            })
        })
        .then(() => {
            let canvas = document.querySelector("#myChart");
            let ctx = canvas.getContext("2d");
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            let myChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: "ETH Price USD",
                        data: data,
                        backgroundColor: '#444',
                        borderColor: '#0f0',
                        borderWidth: 2,
                        fill: "#aaa",
                        pointRadius: 5,
                        borderJoinStyle: "round"
                    }]
                },
                options: {
                    scales: {
                        y: {
                            grid: {
                                color: "#777",
                                borderWidth: 1

                            },
                            title: {
                                display: true,
                                text: "Price in USD",
                                color: "#ccc"
                            },
                            ticks: {
                                color: "#fff"
                            }
                        },
                        x: {
                            grid: {
                                color: "#444",
                                borderWidth: 1

                            }
                        }
                    }
                }
            });
            document.querySelectorAll(".buttons").forEach(button => {
                button.addEventListener('click', () => {
                    myChart.destroy();
                })
            });

        })
}

function dateCalc(time) {
    today = new Date()

    // 86400000ms in a day
    // multiplied by days needed
    // 3600000ms = 1h for time zone correction
    days = 86400000 * time - 3600000;
    newDate = new Date(today - days)

    const formatted = newDate.toISOString().split('.')[0].replace(/:/g, "%3A") + "Z";

    return formatted;
}