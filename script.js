// ==========================
// CEK LOGIN
// ==========================

if (localStorage.getItem("isLogin") !== "true") {
    window.location.href = "login.html";
}


// ==========================
// DATA
// ==========================

let transaksi =
    JSON.parse(localStorage.getItem("transaksi")) || [];

let expenseChart;


// ==========================
// ELEMENT
// ==========================

const form =
    document.getElementById("formTransaksi");

const daftar =
    document.getElementById("daftarTransaksi");

const saldoElement =
    document.getElementById("saldo");

const pemasukanElement =
    document.getElementById("pemasukan");

const pengeluaranElement =
    document.getElementById("pengeluaran");

const filterBulan =
    document.getElementById("filterBulan");

const filterKategori =
    document.getElementById("filterKategori");


// ==========================
// FORMAT RUPIAH
// ==========================

function formatRupiah(angka) {

    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
    }).format(angka);

}


// ==========================
// SIMPAN DATA
// ==========================

function simpanData() {

    localStorage.setItem(
        "transaksi",
        JSON.stringify(transaksi)
    );

}


// ==========================
// TAMPILKAN TRANSAKSI
// ==========================

function tampilkanTransaksi() {

    daftar.innerHTML = "";

    const bulan =
        filterBulan.value;

    const kategori =
        filterKategori.value;


    const hasil = transaksi.filter(item => {

        const cocokBulan =
            bulan === "all" ||
            new Date(item.tanggalISO).getMonth()
            == Number(bulan);

        const cocokKategori =
            kategori === "all" ||
            item.kategori === kategori;

        return cocokBulan && cocokKategori;

    });


    if (hasil.length === 0) {

        daftar.innerHTML = `
            <p class="empty">
                Tidak ada transaksi.
            </p>
        `;

        return;
    }


    hasil.forEach(item => {

        const index =
            transaksi.indexOf(item);

        const div =
            document.createElement("div");

        div.className = "transaction";


        const tanda =
            item.tipe === "income"
            ? "+"
            : "-";


        const warna =
            item.tipe === "income"
            ? "income-text"
            : "expense-text";


        div.innerHTML = `

            <div class="transaction-info">

                <h3>
                    ${item.deskripsi}
                </h3>

                <small>
                    ${item.kategori}
                    •
                    ${item.tanggal}
                </small>

            </div>


            <div class="transaction-right">

                <span class="amount ${warna}">
                    ${tanda}
                    ${formatRupiah(item.jumlah)}
                </span>

                <button
                    class="delete-btn"
                    onclick="hapusTransaksi(${index})"
                >
                    Hapus
                </button>

            </div>

        `;


        daftar.appendChild(div);

    });

}


// ==========================
// UPDATE SALDO
// ==========================

function updateSaldo() {

    let pemasukan = 0;
    let pengeluaran = 0;


    transaksi.forEach(item => {

        if (item.tipe === "income") {

            pemasukan += item.jumlah;

        } else {

            pengeluaran += item.jumlah;

        }

    });


    const saldo =
        pemasukan - pengeluaran;


    saldoElement.textContent =
        formatRupiah(saldo);

    pemasukanElement.textContent =
        formatRupiah(pemasukan);

    pengeluaranElement.textContent =
        formatRupiah(pengeluaran);

}


// ==========================
// GRAFIK
// ==========================

function updateChart() {

    const kategoriData = {};


    transaksi.forEach(item => {

        if (item.tipe !== "expense") {
            return;
        }


        if (!kategoriData[item.kategori]) {

            kategoriData[item.kategori] = 0;

        }


        kategoriData[item.kategori]
            += item.jumlah;

    });


    const labels =
        Object.keys(kategoriData);

    const values =
        Object.values(kategoriData);


    const ctx =
        document
        .getElementById("expenseChart")
        .getContext("2d");


    if (expenseChart) {

        expenseChart.destroy();

    }


    expenseChart = new Chart(ctx, {

        type: "doughnut",

        data: {

            labels: labels,

            datasets: [{

                label: "Pengeluaran",

                data: values,

                borderWidth: 2

            }]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            plugins: {

                legend: {

                    position: "bottom"

                }

            }

        }

    });

}


// ==========================
// TAMBAH TRANSAKSI
// ==========================

form.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        const deskripsi =
            document.getElementById(
                "deskripsi"
            ).value;


        const jumlah =
            Number(
                document.getElementById(
                    "jumlah"
                ).value
            );


        const tipe =
            document.getElementById(
                "tipe"
            ).value;


        const kategori =
            document.getElementById(
                "kategori"
            ).value;


        const sekarang =
            new Date();


        const dataBaru = {

            deskripsi: deskripsi,

            jumlah: jumlah,

            tipe: tipe,

            kategori: kategori,

            tanggal:
                sekarang.toLocaleDateString(
                    "id-ID"
                ),

            tanggalISO:
                sekarang.toISOString()

        };


        transaksi.push(dataBaru);


        simpanData();

        form.reset();

        refresh();

    }
);


// ==========================
// HAPUS TRANSAKSI
// ==========================

function hapusTransaksi(index) {

    transaksi.splice(index, 1);

    simpanData();

    refresh();

}


// ==========================
// HAPUS SEMUA
// ==========================

document
.getElementById("hapusSemua")
.addEventListener(
    "click",
    function() {

        if (transaksi.length === 0) {
            return;
        }


        const yakin =
            confirm(
                "Yakin ingin menghapus semua transaksi?"
            );


        if (yakin) {

            transaksi = [];

            simpanData();

            refresh();

        }

    }
);


// ==========================
// FILTER
// ==========================

filterBulan.addEventListener(
    "change",
    tampilkanTransaksi
);

filterKategori.addEventListener(
    "change",
    tampilkanTransaksi
);


// ==========================
// DARK MODE
// ==========================

const darkMode =
    document.getElementById("darkMode");


if (
    localStorage.getItem("darkMode")
    === "true"
) {

    document.body.classList.add(
        "dark"
    );

    darkMode.textContent = "☀️";

}


darkMode.addEventListener(
    "click",
    function() {

        document.body.classList.toggle(
            "dark"
        );


        const aktif =
            document.body.classList.contains(
                "dark"
            );


        localStorage.setItem(
            "darkMode",
            aktif
        );


        darkMode.textContent =
            aktif ? "☀️" : "🌙";

    }
);


// ==========================
// LOGOUT
// ==========================

document
.getElementById("logout")
.addEventListener(
    "click",
    function() {

        localStorage.removeItem(
            "isLogin"
        );

        window.location.href =
            "login.html";

    }
);


// ==========================
// REFRESH
// ==========================

function refresh() {

    tampilkanTransaksi();

    updateSaldo();

    updateChart();

}


refresh();