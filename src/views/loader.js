const Loader = {
    view: () => {
        return [
            m("div.files-upload", { style: { "margin-top": "15rem" } },
                m("div.files-upload__progress", [
                    m("svg.preloader-icon[viewBox='0 0 36 36'][fill='none'][xmlns='http://www.w3.org/2000/svg']", [
                        m("circle[cx='18'][cy='18'][r='16'][stroke='#333E4C'][stroke-width='3']"),
                        m("path.preloader-icon__border[d='M2 18C2 26.8366 9.16344 34 18 34C26.8366 34 34 26.8366 34 18C34 9.16344 26.8366 2 18 2'][stroke-width='3'][stroke-linecap='round'][stroke-linejoin='round']")
                    ]),
                    m("div.files-upload__progress-title", [
                        "Procesando... ",

                    ]),

                ])
            )
        ];
    },
};

export default Loader;