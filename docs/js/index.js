
function eval_data() {
    fetch('/eval_data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "data": "test" })
    }).then((res) => {
        return res.json();
    }).then((data) => {
        console.log(data);
    }
    )
}

const submit = document.getElementById('start_button');
submit.addEventListener('click', eval_data);