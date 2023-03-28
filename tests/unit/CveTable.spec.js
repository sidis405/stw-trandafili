import {mount} from '@vue/test-utils';
import CveTable from '@/components/CveTable.vue';

describe('CveTable', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = mount(CveTable);
    });

    test('Il componente è montato correttamente', () => {
        expect(wrapper.vm).toBeTruthy();
    });

    test('Genera tabella correttamente', async () => {
        wrapper.setData({
            cveList: `CVE-2023-21524
        CVE-2023-21560
        CVE-2023-21744
        CVE-2023-21762
        CVE-2023-21737
        CVE-2023-21767`,
            numColumns: 3,
            tableWidth: '50%',
        });

        await wrapper.vm.$nextTick();
        wrapper.find('button').trigger('click');
        await wrapper.vm.$nextTick();

        expect(wrapper.vm.tableData.length).toBe(2);
        expect(wrapper.vm.tableData[0].length).toBe(3);
        expect(wrapper.vm.tableData[1].length).toBe(3);
    });

    test('Valida CVE correttamente', () => {
        const validCve = 'CVE-2023-21524';
        const invalidCve = 'CVE-2023-ABCDEFG';

        expect(wrapper.vm.validateCVEs(validCve).length == 0).toBe(true);
        expect(wrapper.vm.validateCVEs(invalidCve) == 1).toBe(false);
    });

    // I test per copyTableToClipboard e downloadCSV sono difficili da eseguire
    // poiché coinvolgono interazioni con il DOM e il sistema dei file che
    // non sono facilmente accessibili durante il test. Tuttavia, è possibile
    // testare le funzioni generateTableText e generateCSVContent, che
    // sono utilizzate da quelle funzioni.

    test('Genera correttamente il contenuto CSV', () => {
        wrapper.setData({
            tableData: [
                [
                    {value: 'CVE-2023-21524', valid: true},
                    {value: 'CVE-2023-21560', valid: true},
                ],
                [
                    {value: 'CVE-2023-21744', valid: true},
                    {value: 'CVE-2023-21762', valid: true},
                ],
            ],
        });

        const expectedCSVContent = `"CVE-2023-21524","CVE-2023-21560"\n"CVE-2023-21744","CVE-2023-21762"\n`;
        expect(wrapper.vm.generateCSVContent()).toEqual(expectedCSVContent);
    });

    // Il test in questione controlla se il componente è in grado di mostrare e
    // nascondere correttamente il codice della tabella quando si fa clic sul pulsante "toggle-table-code".
    // Il test utilizza il metodo setData per impostare le proprietà del componente e il metodo $nextTick
    // per attendere che le modifiche vengano applicate. Successivamente,
    // il test trova il pulsante tramite il selettore "#toggle-table-code"
    // e lo attiva tramite il metodo trigger('click').
    test('Mostra/nasconde il codice tabella correttamente', async () => {
        wrapper.setData({
            showTableCodeArea: false,
            tableData: [
                [
                    {value: 'CVE-2023-21524', valid: true},
                    {value: 'CVE-2023-21560', valid: true},
                ],
                [
                    {value: 'CVE-2023-21744', valid: true},
                    {value: 'CVE-2023-21762', valid: true},
                ],
            ],
            tableGenerated: true,
        });

        await wrapper.vm.$nextTick();
        const button = wrapper.find('#toggle-table-code');
        button.trigger('click');

        expect(wrapper.vm.showTableCodeArea).toBe(true);

        button.trigger('click');

        expect(wrapper.vm.showTableCodeArea).toBe(false);
    });


    // Il test verifica se il metodo filterOutDuplicateCVEs del componente funziona correttamente.
    // In particolare, si vuole verificare che il metodo elimini correttamente gli elementi duplicati
    // dall'array di input e aggiunga gli elementi che presentano duplicati all'array duplicateCVEs.
    it('Rimuove CVE duplicati e aggiunge gli CVE che presentano duplicati al duplicateCVEs array', () => {
        const cves = ['CVE-2020-1234', 'CVE-2020-1234', 'CVE-2021-5678', 'CVE-2022-9999'];
        const expectedUniqueCves = ['CVE-2020-1234', 'CVE-2021-5678', 'CVE-2022-9999'];
        const expectedDuplicateCVEs = ['CVE-2020-1234'];

        const uniqueCves = wrapper.vm.filterOutDuplicateCVEs(cves);

        expect(uniqueCves).toEqual(expectedUniqueCves);
        expect(wrapper.vm.duplicateCVEs).toEqual(expectedDuplicateCVEs);
    });

    // Test di verifica se il metodo filterOutDuplicateCVEs del componente restituisce l'array iniziale
    // passato come parametro se non ci sono elementi duplicati. Viene creato un array cves senza elementi
    // duplicati e viene verificato che la variabile uniqueCves restituita dal metodo sia uguale all'array cves
    // e che la variabile duplicateCVEs sia un array vuoto.
    it('Restituisce l\'array iniziale se non ci sono duplicati', () => {
        const cves = ['CVE-2020-1234', 'CVE-2021-5678', 'CVE-2022-9999'];

        const uniqueCves = wrapper.vm.filterOutDuplicateCVEs(cves);

        expect(uniqueCves).toEqual(cves);
        expect(wrapper.vm.duplicateCVEs).toEqual([]);
    });

    // Test che controlla che se l'array passato alla funzione filterOutDuplicateCVEs()
    // è vuoto, allora la funzione restituisce un array vuoto e l'array duplicateCVEs nel componente è anche vuoto.
    // Ciò significa che se non ci sono elementi nell'array, non ci saranno duplicati da rimuovere e
    // l'array rimarrà vuoto.
    it('Restituisce un array vuoto se l\'array originale è vuoto', () => {
        const cves = [];

        const uniqueCves = wrapper.vm.filterOutDuplicateCVEs(cves);

        expect(uniqueCves).toEqual([]);
        expect(wrapper.vm.duplicateCVEs).toEqual([]);
    });
});
