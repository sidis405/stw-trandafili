/** @type {import('tailwindcss').Config} */
module.exports = {
    purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
    content: [],
    theme: {
        extend: {
            transitionProperty: {
                width: "width"
            }
        }
    },
    plugins: [
        require('@tailwindcss/forms'),
    ],
}
