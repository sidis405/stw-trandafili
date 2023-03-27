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

    test('Genera correttamente il testo della tabella', () => {
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

        const expectedTableText = `CVE-2023-21524\tCVE-2023-21560\nCVE-2023-21744\tCVE-2023-21762\n`;
        expect(wrapper.vm.generateTableText()).toEqual(expectedTableText);
    });

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
});
