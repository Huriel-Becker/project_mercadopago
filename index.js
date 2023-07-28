const express = require("express");
const MercadoPago = require("mercadopago");
const app = express();

MercadoPago.configure({
    sandbox: true,
    access_token: "token"
});

app.get("/", (req, res ) => {
    res.send("Olá mundo!");
});

app.get("/pagar", async (req, res) => {

    // Table Payment
    // id // code // payer // status

    const id = "" + Date.now();
    const payerEmail = "email@email.com";

    const data = {
        items: [
            item = {
                id: id,
                title: "2x video games",
                quantity: 1,
                currency_id: 'BRL',
                unit_price: parseFloat(150)
            }
        ],
        payer: {
            email: payerEmail
        },
        external_reference: id
    }

    try {
        const payment = await MercadoPago.preferences.create(data);
        //dataBank.SavingPayment({id: id, payer: payerEmail});
        return res.redirect(payment.body.init_point);
    } catch (error) {
        return res.send(error.message);
    }
    
});

app.post("/not", (req, res) => {
    const id = req.query.id;

    setTimeout(() => {
        const filter = {
            "order.id": id
        }
        MercadoPago.payment.search({
            qs: filter
        }).then(data => {
            const payment = data.body.results[0];

            if(payment != undefined){
                console.log(payment.external_reference);
                console.log(payment.status); //aproved

                if (payment.status === "aproved") {
                    dataBank.defineAsPayed(payment.external_reference)
                } else {
                    console.log("Não está aprovadp");
                }

            }else{
                console.log("Pagamento não existe");
            }

        }).catch(err => {
            console.log(err);
        });

    }, 20000);

    res.send("Ok");
});

app.listen(80, (req, res) => {
    console.log("Servidor Rodando");
});