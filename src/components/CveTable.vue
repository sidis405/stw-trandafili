<!--
Il template HTML del componente ToolCveList è diviso in diverse sezioni:
- Un'intestazione fissa contenente il titolo della prova pratica.
- Un titolo e una descrizione che spiegano la funzione del componente.
- Una textarea per inserire i CVEs, che viene controllata per validare la formattazione.
- Due menu a tendina per selezionare il numero di colonne e la larghezza della tabella.
- Due pulsanti per generare la tabella e per copiarla negli appunti come testo tabulare o per scaricarla come file CSV.
- La tabella generata, contenente la lista di CVEs.
-->
<template>
  <div class="p-4 container mx-auto">
    <!-- Intestazione fissa -->
    <div class="fixed bottom-0 left-0 right-0 z-40 px-4 py-3 text-center text-white bg-gray-800">
      Prova pratica STW - Sidrit Trandafili
    </div>
    <!-- Titolo e descrizione del tool -->
    <h2 class="text-base font-semibold leading-7 text-gray-900">Tool per la formattazione di una lista CVE</h2>
    <p class="mt-1 mb-2 text-sm leading-6 text-gray-600">Incolla la lista CVE, uno per riga, configura le opzioni e
      genera la tabella</p>
    <p class="mt-1 mb-2 text-sm leading-6 text-gray-600">A seguito potrai copiare la tabella in memoria o scaricarla
      come CSV</p>
    <!-- Form per l'input della lista di CVE -->
    <div class="mb-4">
      <label for="about" class="block text-sm font-medium leading-6 text-gray-900">Lista CVE</label>
      <textarea
          id="cve-list"
          v-model="cveList"
          rows="10"
          @input="validateCVEs"
          :class="`block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:py-1.5 sm:text-sm sm:leading-6 ${invalidCVEs.length > 0 ? 'ring-2 ring-inset ring-red-600' : ''}`"
      ></textarea>
      <!-- Messaggio di errore in caso di input non valido -->
      <p v-if="invalidCVEs.length > 0" class="mt-1 text-sm text-red-600">I seguenti CVE non sono validi:
        {{ invalidCVEs.join(', ') }}</p>
    </div>
    <!-- Selezione del numero di colonne e larghezza della tabella -->
    <div class="flex mb-4 gap-3">
      <div class="mb-4 w-full">
        <label for="num-columns" class="block mb-2">Numero colonne:</label>
        <select
            id="num-columns"
            v-model="numColumns"
            class="w-full p-2 border rounded"
        >
          <option>2</option>
          <option>3</option>
          <option>4</option>
          <option>5</option>
        </select>
      </div>
      <div class="mb-4 w-full">
        <label for="table-width" class="block mb-2">Larghezza tabella:</label>
        <select
            id="table-width"
            v-model="tableWidth"
            class="w-full p-2 border rounded"
        >
          <option>30%</option>
          <option>40%</option>
          <option>50%</option>
          <option>60%</option>
          <option>70%</option>
          <option>80%</option>
          <option>90%</option>
          <option>100%</option>
        </select>
      </div>
    </div>
    <div class="flex justify-between" v-if="this.invalidCVEs.length == 0">
      <button
          @click="generateTable"
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
      >
        Genera tabella
      </button>

      <div v-if="tableGenerated">
        <button
            @click="copyTableToClipboard"
            class="bg-green-500 text-white px-4 py-2 rounded mr-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
               stroke="currentColor"
               class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round"
                  d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"/>
          </svg>

        </button>
        <button
            @click="downloadCSV"
            class="bg-yellow-500 text-white px-4 py-2 rounded"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
               stroke="currentColor"
               class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round"
                  d="M7.5 7.5h-.75A2.25 2.25 0 004.5 9.75v7.5a2.25 2.25 0 002.25 2.25h7.5a2.25 2.25 0 002.25-2.25v-7.5a2.25 2.25 0 00-2.25-2.25h-.75m-6 3.75l3 3m0 0l3-3m-3 3V1.5m6 9h.75a2.25 2.25 0 012.25 2.25v7.5a2.25 2.25 0 01-2.25 2.25h-7.5a2.25 2.25 0 01-2.25-2.25v-.75"/>
          </svg>
        </button>
      </div>
    </div>

    <div v-if="tableGenerated" class="mt-4 ">
      <table
          :style="{width: tableWidth}"
          class="w-full border-collapse border border-gray-300 transition-all duration-500"
      >
        <thead>
        <tr>
          <th class="font-bold text-center p-3" :colspan="numColumns">CVE-IDs</th>
        </tr>
        </thead>
        <tr v-for="(row, rowIndex) in tableData" :key="rowIndex" class="even:bg-white odd:bg-gray-200">
          <td
              v-for="(cell, cellIndex) in row"
              :key="cellIndex"
              :class="{
              'invalid-cve': !cell.valid,
              'border': true,
              'border-gray-300': true,
              'p-2': true,
            }"
          >
            {{ cell.value }}
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>


<script>
export default {
  data() {
    return {
      cveList: '', //  è una stringa che rappresenta la lista di CVE da visualizzare nella tabella.
      numColumns: 3, //  è un numero intero che rappresenta il numero di colonne che deve avere la tabella.
      tableWidth: '100%', //  è una stringa che rappresenta la larghezza della tabella.
      tableData: [], //  è una matrice che rappresenta i dati della tabella generati a partire dalla lista di CVE inserita.
      tableGenerated: false, // è un booleano che indica se la tabella è stata generata o meno.
      invalidCVEs: [], //  è una lista che contiene le CVE non valide inserite dall'utente.
    };
  },
  methods: {
    // Questa funzione verifica la validità di ciascuna linea del testo di input CVE
    // utilizzando un'espressione regolare che controlla se il formato della linea è corretto.
    // Tutte le linee valide vengono salvate in un array, mentre le linee non valide vengono salvate
    // in un altro array. Se vengono rilevate linee non valide, il valore di tableGenerated viene impostato su false.
    // La funzione restituisce l'array di linee valide.
    validateCVEs() {
      const regex = /^CVE-\d{4}-\d{4,7}$/;
      const allLines = this.cveList.split('\n');
      const validCVEs = [];
      this.invalidCVEs = [];

      for (let line of allLines) {
        const trimmedLine = line.trim();
        if (trimmedLine !== '') {
          if (regex.test(trimmedLine)) {
            validCVEs.push(trimmedLine);
          } else {
            this.invalidCVEs.push(trimmedLine);
            this.tableGenerated = false;
          }
        }
      }

      return validCVEs;
    },

    // Controlla se ci sono CVE non valide, e se ce ne sono restituisce subito.
    // Successivamente valida le CVE tramite la funzione validateCVEs e, se valide,
    // genera una matrice di oggetti row e value, dove ogni oggetto rappresenta una cella
    // della tabella, e la salva nella variabile tableData.
    // Infine, imposta il valore della variabile tableGenerated su true.
    generateTable() {
      if (this.invalidCVEs.length > 0) return;

      const cves = this.validateCVEs();
      if (!cves) return;

      const numRows = Math.ceil(cves.length / this.numColumns);
      const table = [];

      for (let i = 0; i < numRows; i++) {
        const row = [];
        for (let j = 0; j < this.numColumns; j++) {
          const index = i * this.numColumns + j;
          if (index < cves.length) {
            row.push({
              value: cves[index],
              valid: true,
            });
          }
        }
        table.push(row);
      }

      this.tableData = table;
      this.tableGenerated = true;
    },

    // Questa funzione copia il contenuto della tabella negli appunti del sistema operativo
    // creando un elemento textarea temporaneo e impostandone il valore con il contenuto della tabella,
    // selezionando quindi il testo all'interno dell'elemento e copiandolo nella clipboard del sistema operativo,
    // infine rimuove l'elemento textarea temporaneo.
    // Nota: Questa funzione richiede l'accesso al DOM e non è testabile con Jest.
    copyTableToClipboard() {
      const tableText = this.generateTableText();
      const textArea = document.createElement('textarea');
      textArea.value = tableText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    },

    // Questa funzione genera una stringa di testo che rappresenta la tabella dei CVE.
    // Inizia creando una stringa vuota per contenere il testo della tabella.
    // Itera attraverso le righe della tabella usando il metodo forEach(),
    // per ogni riga itera attraverso le celle usando un altro forEach(),
    // aggiungendo il valore di ogni cella alla stringa di testo della tabella,
    // separando ogni valore di cella con una tabulazione "\t".
    // Alla fine di ogni riga, aggiunge un carattere di ritorno a capo "\n" alla stringa di testo della tabella.
    // Restituisce la stringa di testo della tabella generata.
    generateTableText() {
      let tableText = '';
      this.tableData.forEach(row => {
        row.forEach(cell => {
          tableText += cell.value + '\t';
        });
        tableText = tableText.trim() + '\n';
      });
      return tableText;
    },

    downloadCSV() {
      // Genera il contenuto del file CSV
      const csvContent = this.generateCSVContent();

      // Crea un nuovo Blob con il contenuto CSV e il tipo MIME specificato
      const blob = new Blob([csvContent], {type: 'text/csv;charset=utf-8;'});

      // Crea un URL che rappresenta il Blob
      const url = URL.createObjectURL(blob);

      // Crea un elemento di tipo anchor e gli assegna l'URL del Blob come href e il nome del file come download
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', 'table.csv');

      // Imposta la visibilità del link a "hidden"
      link.style.visibility = 'hidden';

      // Aggiunge il link alla pagina web
      document.body.appendChild(link);

      // Simula il click del link per avviare il download
      link.click();

      // Rimuove il link dalla pagina web
      document.body.removeChild(link);
    },

    // Questa funzione genera il contenuto CSV della tabella
    // Itera su ogni riga e colonna della tabella, aggiungendo ogni cella
    // al contenuto CSV e sostituendo eventuali doppi apici nel valore
    // della cella con due doppi apici per evitare errori nel formato CSV
    // Restituisce il contenuto CSV generato come stringa
    generateCSVContent() {
      let csvContent = '';
      this.tableData.forEach(row => {
        row.forEach(cell => {
          csvContent += '"' + cell.value.replace(/"/g, '""') + '",';
        });
        csvContent = csvContent.slice(0, -1) + '\n';
      });
      return csvContent;
    },
  },
};
</script>
