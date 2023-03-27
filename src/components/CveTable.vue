<template>
  <div class="p-4">
    <div class="mb-4">
      <label for="cve-list" class="block mb-2">Lista CVE:</label>
      <textarea
          id="cve-list"
          v-model="cveList"
          @input="validateCVEs"
          class="w-full p-2 border rounded"
      ></textarea>
    </div>
    <div class="mb-4">
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
    <div class="mb-4">
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
    <button
        @click="generateTable"
        class="bg-blue-500 text-white px-4 py-2 rounded mr-2"
    >
      Genera tabella
    </button>
    <button
        @click="copyTableToClipboard"
        class="bg-green-500 text-white px-4 py-2 rounded mr-2"
    >
      Copia in memoria
    </button>
    <button
        @click="downloadCSV"
        class="bg-yellow-500 text-white px-4 py-2 rounded"
    >
      Scarica come CSV
    </button>
    <div v-if="tableGenerated" class="mt-4">
      <table
          :style="{width: tableWidth}"
          class="w-full border-collapse border border-gray-300"
      >
        <tr v-for="(row, rowIndex) in tableData" :key="rowIndex">
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
      cveList: '',
      numColumns: 2,
      tableWidth: '50%',
      tableData: [],
      tableGenerated: false,
    };
  },
  methods: {
    validateCVEs() {
      const regex = /CVE-\d{4}-\d{4,7}/g;
      const cves = this.cveList.match(regex);
      return cves;
    },
    generateTable() {
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
    copyTableToClipboard() {
      const tableText = this.generateTableText();
      const textArea = document.createElement('textarea');
      textArea.value = tableText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    },
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
      const csvContent = this.generateCSVContent();
      const blob = new Blob([csvContent], {type: 'text/csv;charset=utf-8;'});
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', 'table.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
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
