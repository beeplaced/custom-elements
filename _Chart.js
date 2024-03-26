import { COMPONENTS } from './_Base.js';
import { Button } from './_Button.js';
import { Window } from './_Window.js';

const d = document

class TITLE extends COMPONENTS {

    static instanceCount = 0;

    constructor(input) {
        super();
        this.data = this.divc({ class: 'chart-title _t', content: input.title })
        this.render()
    }
    render() {
        this.innerHTML = this.data
    }

}; customElements.define('chart-title', TITLE);

export class _CHARTBODY extends COMPONENTS {

    constructor(input) {
        super();
        //input title, datalabels, height
        this.title = input?.title ? input.title : 'chart'
        this.chartData = {};
        this.classList.add('chart-container');
        this.chartOptionsGiven = {
            dataLabels: { enabled: input?.datalabels ? input.datalabels : false },
            legend: { show: false },
            stroke: { show: false },
        };
        this.chartOptionsChartGiven = {};
        this.chartOptionsChartGiven.fontFamily = 'Poppins,sans-serif';
        this.chartOptionsChartGiven.foreColor = '#bdc1c6';
        this.chartOptionsChartGiven.height = input?.height ? input.height : 400
        this.chartOptionsChartGiven.redrawOnWindowResize = false
        this.chartOptionsChartGiven.redrawOnParentResize = false
        this.chartOptionsChartGiven.toolbar = { show: false }
        this.chartOptionsChartGiven.dropShadow = { enabled: true }
        this.chartOptionsChartGiven.zoom = { enabled: false }
    }

    connectedCallback() {
        this.render();
    }

    options = () => {//overwrite

    }

    handleResize = (e) => {
        this.chart.updateOptions({
            // Updated chart options here
        });
    }

    toPNG = () => {
        this.chart.dataURI().then((en) => {
            const dataUri = en.imgURI
            const downloadLink = d.createElement('a');
            downloadLink.href = dataUri;
            downloadLink.download = `${this.title}.png`;
            d.body.appendChild(downloadLink);
            downloadLink.click();
            d.body.removeChild(downloadLink);
        })
    }

    chartOptionsClick = () => {
        const window = new Window({
            title: 'Chart Options and functionalities',
            drag: true,
            center: true,
            modal: false,
        })
        window.render()
        let wb = this.divocol({})
        wb += this.divc({ class: 'tab-sort-options', content: 'Show Data Table' })
        wb += this.divc({ class: 'tab-sort-options', content: 'Output as .png' })
        wb += this.end(1)
        window.body.innerHTML = wb
        window.addEventListener('click', (e) => {
            const target = e.target
            console.log(target)
            if (!target.classList.contains('tab-sort-options')) return
            this.toPNG()
        })
    }

    addTitle = () => {
        const title = new TITLE({ title: this.title || 'my chart' })
        this.appendChild(title)
        // const moreBtn = new Button({ title: "dotsOpenHor", type: "form_add", addclass: "btn-execute-head" })
        // title.appendChild(moreBtn)
        // moreBtn.addEventListener('click', () => {
        //     this.chartOptionsClick()
        // })
    }

    render() {
        this.addTitle()
        this.chartbox = document.createElement('div');
        this.appendChild(this.chartbox)
        this.options()
        this.chart = new ApexCharts(this.chartbox, this.chartOptions);
        this.chart.render().then(() => {
            window.addEventListener('resize', this.handleResize);
        })
    }

    //   document.getElementById('downloadButton').addEventListener('click', function() {
    //         // Get the SVG content of the chart
    //         apexChart.toSVG().then(svgContent => {
    //             // Create a blob from the SVG content
    //             const blob = new Blob([svgContent], { type: 'image/svg+xml' });

    //             // Create a download link
    //             const link = document.createElement('a');
    //             link.href = window.URL.createObjectURL(blob);
    //             link.download = 'chart.svg';

    //             // Append the link to the document and trigger a click event
    //             document.body.appendChild(link);
    //             link.click();

    //             // Remove the link from the document
    //             document.body.removeChild(link);
    //         });


}; customElements.define('apex-chart', _CHARTBODY);

export class COLUMNEGATIVE extends _CHARTBODY {
    //https://apexcharts.com/javascript-chart-demos/timeline-charts/basic/
    constructor() {
        super();
        this.title = "Column Charts > Column with Negative Values"
        this.chartOptions = {
            series: [{
                name: 'Cash Flow',
                data: [1.45, 5.42, 5.9, -0.42, -12.6, -18.1, -18.2, -14.16, -11.1, -6.09, 0.34, 3.88, 13.07,
                    5.8, 2, 7.37, 8.1, 13.57, 15.75, 17.1, 19.8, -27.03, -54.4, -47.2, -43.3, -18.6, -
                    48.6, -41.1, -39.6, -37.6, -29.4, -21.4, -2.4
                ]
            }],
            ...this.chartOptionsGiven,
            chart: {
                type: 'bar',
                ...this.chartOptionsChartGiven
            },
            plotOptions: {
                bar: {
                    colors: {
                        ranges: [{
                            from: -100,
                            to: -46,
                            color: '#F15B46'
                        }, {
                            from: -45,
                            to: 0,
                            color: '#FEB019'
                        }]
                    },
                    columnWidth: '80%',
                }
            },
            yaxis: {
                title: {
                    text: 'Growth',
                },
                labels: {
                    formatter: function (y) {
                        return y.toFixed(0) + "%";
                    }
                }
            },
            xaxis: {
                type: 'datetime',
                categories: [
                    '2011-01-01', '2011-02-01', '2011-03-01', '2011-04-01', '2011-05-01', '2011-06-01',
                    '2011-07-01', '2011-08-01', '2011-09-01', '2011-10-01', '2011-11-01', '2011-12-01',
                    '2012-01-01', '2012-02-01', '2012-03-01', '2012-04-01', '2012-05-01', '2012-06-01',
                    '2012-07-01', '2012-08-01', '2012-09-01', '2012-10-01', '2012-11-01', '2012-12-01',
                    '2013-01-01', '2013-02-01', '2013-03-01', '2013-04-01', '2013-05-01', '2013-06-01',
                    '2013-07-01', '2013-08-01', '2013-09-01'
                ],
                labels: {
                    rotate: -90
                }
            }
        };
    }
}; customElements.define('apex-column-negative-chart', COLUMNEGATIVE);

export class TIMELINESIMPLE extends _CHARTBODY {

    constructor() {
        super();
        const type = 'rangeBar'
        this.title = "https://apexcharts.com/javascript-chart-demos/timeline-charts/basic/"
        this.chartOptions = {
            series: [
                {
                    data: [
                        {
                            x: 'Audit Preparation',
                            y: [
                                new Date('2019-03-02').getTime(),
                                new Date('2019-03-04').getTime()
                            ]
                        },
                        {
                            x: 'Audit Conduction',
                            y: [
                                new Date('2019-03-04').getTime(),
                                new Date('2019-03-08').getTime()
                            ]
                        },
                        {
                            x: 'Data Gathering',
                            y: [
                                new Date('2019-03-08').getTime(),
                                new Date('2019-03-12').getTime()
                            ]
                        },
                        {
                            x: 'Audit finish',
                            y: [
                                new Date('2019-03-12').getTime(),
                                new Date('2019-03-18').getTime()
                            ]
                        }
                    ]
                }
            ],
            ...this.chartOptionsGiven, chart: { type, ...this.chartOptionsChartGiven },
            plotOptions: {
                bar: {
                    horizontal: true
                }
            },
            xaxis: {
                type: 'datetime'
            }
        }
    }

}; customElements.define('apex-timeline-simple-chart', TIMELINESIMPLE);

export class TIMELINE extends _CHARTBODY {

    //https://apexcharts.com/javascript-chart-demos/timeline-charts/multiple-series-group-rows/

    constructor() {
        super();
        const type = 'rangeBar'
        this.title = "Timeline Charts | Multiple series | Group rows"
        this.chartOptions = {
            series: [
                // George Washington
                {
                    name: 'George Washington',
                    data: [
                        {
                            x: 'President',
                            y: [
                                new Date(1789, 3, 30).getTime(),
                                new Date(1797, 2, 4).getTime()
                            ]
                        },
                    ]
                },
                // John Adams
                {
                    name: 'John Adams',
                    data: [
                        {
                            x: 'President',
                            y: [
                                new Date(1797, 2, 4).getTime(),
                                new Date(1801, 2, 4).getTime()
                            ]
                        },
                        {
                            x: 'Vice President',
                            y: [
                                new Date(1789, 3, 21).getTime(),
                                new Date(1797, 2, 4).getTime()
                            ]
                        }
                    ]
                },
                // Thomas Jefferson
                {
                    name: 'Thomas Jefferson',
                    data: [
                        {
                            x: 'President',
                            y: [
                                new Date(1801, 2, 4).getTime(),
                                new Date(1809, 2, 4).getTime()
                            ]
                        },
                        {
                            x: 'Vice President',
                            y: [
                                new Date(1797, 2, 4).getTime(),
                                new Date(1801, 2, 4).getTime()
                            ]
                        },
                        {
                            x: 'Secretary of State',
                            y: [
                                new Date(1790, 2, 22).getTime(),
                                new Date(1793, 11, 31).getTime()
                            ]
                        }
                    ]
                },
                // Aaron Burr
                {
                    name: 'Aaron Burr',
                    data: [
                        {
                            x: 'Vice President',
                            y: [
                                new Date(1801, 2, 4).getTime(),
                                new Date(1805, 2, 4).getTime()
                            ]
                        }
                    ]
                },
                // George Clinton
                {
                    name: 'George Clinton',
                    data: [
                        {
                            x: 'Vice President',
                            y: [
                                new Date(1805, 2, 4).getTime(),
                                new Date(1812, 3, 20).getTime()
                            ]
                        }
                    ]
                },
                // John Jay
                {
                    name: 'John Jay',
                    data: [
                        {
                            x: 'Secretary of State',
                            y: [
                                new Date(1789, 8, 25).getTime(),
                                new Date(1790, 2, 22).getTime()
                            ]
                        }
                    ]
                },
                // Edmund Randolph
                {
                    name: 'Edmund Randolph',
                    data: [
                        {
                            x: 'Secretary of State',
                            y: [
                                new Date(1794, 0, 2).getTime(),
                                new Date(1795, 7, 20).getTime()
                            ]
                        }
                    ]
                },
                // Timothy Pickering
                {
                    name: 'Timothy Pickering',
                    data: [
                        {
                            x: 'Secretary of State',
                            y: [
                                new Date(1795, 7, 20).getTime(),
                                new Date(1800, 4, 12).getTime()
                            ]
                        }
                    ]
                },
                // Charles Lee
                {
                    name: 'Charles Lee',
                    data: [
                        {
                            x: 'Secretary of State',
                            y: [
                                new Date(1800, 4, 13).getTime(),
                                new Date(1800, 5, 5).getTime()
                            ]
                        }
                    ]
                },
                // John Marshall
                {
                    name: 'John Marshall',
                    data: [
                        {
                            x: 'Secretary of State',
                            y: [
                                new Date(1800, 5, 13).getTime(),
                                new Date(1801, 2, 4).getTime()
                            ]
                        }
                    ]
                },
                // Levi Lincoln
                {
                    name: 'Levi Lincoln',
                    data: [
                        {
                            x: 'Secretary of State',
                            y: [
                                new Date(1801, 2, 5).getTime(),
                                new Date(1801, 4, 1).getTime()
                            ]
                        }
                    ]
                },
                // James Madison
                {
                    name: 'James Madison',
                    data: [
                        {
                            x: 'Secretary of State',
                            y: [
                                new Date(1801, 4, 2).getTime(),
                                new Date(1809, 2, 3).getTime()
                            ]
                        }
                    ]
                },
            ],
            ...this.chartOptionsGiven, chart: { type, ...this.chartOptionsChartGiven },
            plotOptions: {
                bar: {
                    horizontal: true,
                    barHeight: '50%',
                    rangeBarGroupRows: true
                }
            },
            colors: [
                "#008FFB", "#00E396", "#FEB019", "#FF4560", "#775DD0",
                "#3F51B5", "#546E7A", "#D4526E", "#8D5B4C", "#F86624",
                "#D7263D", "#1B998B", "#2E294E", "#F46036", "#E2C044"
            ],
            fill: {
                type: 'solid'
            },
            xaxis: {
                type: 'datetime'
            },
            legend: {
                position: 'right'
            },
            tooltip: {
                custom: function (opts) {
                    const fromYear = new Date(opts.y1).getFullYear()
                    const toYear = new Date(opts.y2).getFullYear()
                    const values = opts.ctx.rangeBar.getTooltipValues(opts)

                    return (
                        '<div class="apexcharts-tooltip-rangebar">' +
                        '<div> <span class="series-name" style="color: ' +
                        values.color +
                        '">' +
                        (values.seriesName ? values.seriesName : '') +
                        '</span></div>' +
                        '<div> <span class="category">' +
                        values.ylabel +
                        ' </span> <span class="value start-value">' +
                        fromYear +
                        '</span> <span class="separator">-</span> <span class="value end-value">' +
                        toYear +
                        '</span></div>' +
                        '</div>'
                    )
                }
            }
        };
    }
}; customElements.define('apex-timeline-chart', TIMELINE);

export class DONUT extends _CHARTBODY {

    constructor() {
        super();
        const type = 'donut'
        this.title = "Donut"
        this.chartOptions = {
            series: [44, 55, 41, 17, 15],
            ...this.chartOptionsGiven, chart: { type, ...this.chartOptionsChartGiven },
        }
    }

}; customElements.define('apex-donut-chart', DONUT);

export class HEATMAP extends _CHARTBODY {

    constructor() {
        super();
        const type = 'heatmap'
        this.title = 'HeatMap Chart with Color Range'
        function generateData(rows, range) {
            const data = [];
            for (let i = 0; i < rows; i++) {
                const value = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
                data.push(value);
            }
            return data;
        }

        this.chartOptions = {
            series: [{
                name: 'Jan',
                data: generateData(20, {
                    min: -30,
                    max: 55
                })
            },
            {
                name: 'Feb',
                data: generateData(20, {
                    min: -30,
                    max: 55
                })
            },
            {
                name: 'Mar',
                data: generateData(20, {
                    min: -30,
                    max: 55
                })
            },
            {
                name: 'Apr',
                data: generateData(20, {
                    min: -30,
                    max: 55
                })
            },
            {
                name: 'May',
                data: generateData(20, {
                    min: -30,
                    max: 55
                })
            },
            {
                name: 'Jun',
                data: generateData(20, {
                    min: -30,
                    max: 55
                })
            },
            {
                name: 'Jul',
                data: generateData(20, {
                    min: -30,
                    max: 55
                })
            },
            {
                name: 'Aug',
                data: generateData(20, {
                    min: -30,
                    max: 55
                })
            },
            {
                name: 'Sep',
                data: generateData(20, {
                    min: -30,
                    max: 55
                })
            }
            ],
            ...this.chartOptionsGiven, chart: { type, ...this.chartOptionsChartGiven },
            plotOptions: {
                heatmap: {
                    shadeIntensity: 0.5,
                    radius: 0,
                    useFillColorAsStroke: true,
                    colorScale: {
                        ranges: [{
                            from: -30,
                            to: 5,
                            name: 'low',
                            color: '#00A100'
                        },
                        {
                            from: 6,
                            to: 20,
                            name: 'medium',
                            color: '#128FD9'
                        },
                        {
                            from: 21,
                            to: 45,
                            name: 'high',
                            color: '#FFB200'
                        },
                        {
                            from: 46,
                            to: 55,
                            name: 'extreme',
                            color: '#FF0000'
                        }
                        ]
                    }
                }
            },
            dataLabels: {
                enabled: false
            },
            stroke: {
                width: 1
            },
        };
    }
}; customElements.define('apex-heatmap', HEATMAP);

export class STACKEDBAR100 extends _CHARTBODY {

    constructor() {
        super();
        const type = 'bar'
        this.title = '100% Stacked Bar'
        this.chartOptions = {
            series: [{
                name: 'Marine Sprite',
                data: [44, 55, 41, 37, 22, 43, 21]
            }, {
                name: 'Striking Calf',
                data: [53, 32, 33, 52, 13, 43, 32]
            }, {
                name: 'Tank Picture',
                data: [12, 17, 11, 9, 15, 11, 20]
            }, {
                name: 'Bucket Slope',
                data: [9, 7, 5, 8, 6, 9, 4]
            }, {
                name: 'Reborn Kid',
                data: [25, 12, 19, 32, 25, 24, 10]
            }],
            ...this.chartOptionsGiven, chart: {
                type, ...this.chartOptionsChartGiven, stacked: true,
                stackType: '100%'
            },
            plotOptions: {
                bar: {
                    horizontal: true,
                },
            },
            stroke: {
                width: 1,
                colors: ['#fff']
            },
            xaxis: {
                categories: [2008, 2009, 2010, 2011, 2012, 2013, 2014],
            },
            tooltip: {
                y: {
                    formatter: function (val) {
                        return val + "K"
                    }
                }
            },
            fill: {
                opacity: 1

            },
            legend: {
                position: 'top',
                horizontalAlign: 'left',
                offsetX: 40
            }
        };
    }
}; customElements.define('apex-stacked-bar-100-chart', STACKEDBAR100);

export class POLARAREA extends _CHARTBODY {

    constructor() {
        super();
        this.title = '/polar-area-charts'
        const type = 'polarArea'
        this.chartOptions = {
            series: [14, 23, 21, 17, 15, 10, 12, 17, 21],
            ...this.chartOptionsGiven, chart: { type, ...this.chartOptionsChartGiven },
            stroke: {
                colors: ['#fff']
            },
            fill: {
                opacity: 0.8
            },
            responsive: [{
                breakpoint: 480,
                options: {
                    chart: {

                    },
                    legend: {
                        position: 'bottom'
                    }
                }
            }]
        };
    }
}; customElements.define('apex-polar-chart', POLARAREA);

export class DUMBELLCHART extends _CHARTBODY {

    constructor() {
        super();
        this.title = 'Paygap Disparity / Dumbell Chart'
        const type = 'rangeBar'
        this.chartOptions = {
            series: [
                {
                    data: [
                        {
                            x: 'Operations',
                            y: [2800, 4500]
                        },
                        {
                            x: 'Customer Success',
                            y: [3200, 4100]
                        },
                        {
                            x: 'Engineering',
                            y: [2950, 7800]
                        },
                        {
                            x: 'Marketing',
                            y: [3000, 4600]
                        },
                        {
                            x: 'Product',
                            y: [3500, 4100]
                        },
                        {
                            x: 'Data Science',
                            y: [4500, 6500]
                        },
                        {
                            x: 'Sales',
                            y: [4100, 5600]
                        }
                    ]
                }
            ],
            ...this.chartOptionsGiven, chart: { type, ...this.chartOptionsChartGiven },
            colors: ['#EC7D31', '#36BDCB'],
            plotOptions: {
                bar: {
                    horizontal: true,
                    isDumbbell: true,
                    dumbbellColors: [['#EC7D31', '#36BDCB']]
                }
            },
            legend: {
                show: true,
                showForSingleSeries: true,
                position: 'top',
                horizontalAlign: 'left',
                customLegendItems: ['Female', 'Male']
            },
            fill: {
                type: 'gradient',
                gradient: {
                    gradientToColors: ['#36BDCB'],
                    inverseColors: false,
                    stops: [0, 100]
                }
            },
            grid: {
                xaxis: {
                    lines: {
                        show: true
                    }
                },
                yaxis: {
                    lines: {
                        show: false
                    }
                }
            }
        };
    }
}; customElements.define('apex-dumbell-chart', DUMBELLCHART);

export class PIECHART extends _CHARTBODY {

    constructor() {
        super();
        const type = 'pie'
        this.title = 'Simple Bubble Pie Chart'
        this.chartData = {
            labels: ['Apple', 'Banana', 'Orange', 'Mango', 'Grapes'],
            data: [44, 55, 13, 43, 22]
        };

        this.chartOptions = {
            ...this.chartOptionsGiven, chart: { type, ...this.chartOptionsChartGiven },
            labels: this.chartData.labels,
            series: this.chartData.data,
            responsive: [{
                breakpoint: 480,
                options: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }]
        };
    }
}; customElements.define('apex-pie-chart', PIECHART);

export class BUBBLECHART extends _CHARTBODY {

    constructor() {
        super();
        this.title = 'Simple Bubble Chart'
        const type = 'bubble'
        const generateData = (timestamp, count, range) => {
            const series = [];
            for (let i = 0; i < count; i++) {
                series.push({
                    x: timestamp + i * 86400000, // 1 day interval
                    y: Math.floor(Math.random() * (range.max - range.min + 1)) + range.min,
                    z: Math.floor(Math.random() * (range.max - range.min + 1)) + range.min
                });
            }
            return series;
        };

        this.chartOptions = {
            series: [{
                name: 'Bubble1',
                data: generateData(new Date('11 Feb 2017 GMT').getTime(), 20, {
                    min: 10,
                    max: 60
                })
            },
            {
                name: 'Bubble2',
                data: generateData(new Date('11 Feb 2017 GMT').getTime(), 20, {
                    min: 10,
                    max: 60
                })
            },
            {
                name: 'Bubble3',
                data: generateData(new Date('11 Feb 2017 GMT').getTime(), 20, {
                    min: 10,
                    max: 60
                })
            },
            {
                name: 'Bubble4',
                data: generateData(new Date('11 Feb 2017 GMT').getTime(), 20, {
                    min: 10,
                    max: 60
                })
            }],
            ...this.chartOptionsGiven, chart: { type, ...this.chartOptionsChartGiven },
            fill: {
                opacity: 0.8
            },
            xaxis: {
                tickAmount: 12,
                type: 'category',
            },
            yaxis: {
                max: 70
            }
        };
    }
}; customElements.define('apex-bubble-chart', BUBBLECHART);

export class CHART extends COMPONENTS {

    constructor(entry) {
        super();
        const months = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];
        function isValidDate(dateString) {
            const date = new Date(dateString);
            return !isNaN(date.getTime());
        }

        function formatNumberAbbreviated(number) {
            const absNumber = Math.abs(number);

            if (absNumber >= 1e6) {
                // Convert to millions
                return (number / 1e6).toFixed(0) + 'M [€}';
            } else if (absNumber >= 1e3) {
                // Convert to thousands
                return (number / 1e3).toFixed(0) + 'K [€]';
            } else {
                return number.toString();
            }
        }

        const data = []
        const categories = []

        let dateCheck = ''
        // Process data to include labels selectively
        const sums = entry
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .map((a) => {
                const currentDate = new Date(a.date);
                const fullYear = currentDate.getFullYear();
                const cDate = `${fullYear}_${currentDate.getMonth()}`
                let label = ''
                if (cDate !== dateCheck && isValidDate(currentDate)) label = `${months[currentDate.getMonth()]} ${String(fullYear).slice(-2)}`
                dateCheck = `${fullYear}_${currentDate.getMonth()}`
                data.push(a.sum)
                categories.push(label)
                return a.sum
            });

        const max = Math.max(...sums);
        const min = Math.min(...sums);

        this.chartData = {
            series: [{
                name: 'Sum',
                data,
            }],
            chart: {
                type: 'area',
                height: 250,
                toolbar: {
                    show: false, // Hide the toolbar
                },
                fontFamily: 'Poppins,sans-serif;',
                // animations: {
                //     enabled: true,
                //     easing: 'easeinout',
                //     speed: 500,
                //     animateGradually: {
                //         enabled: true,
                //         delay: 150
                //     },
                //     dynamicAnimation: {
                //         enabled: true,
                //         speed: 350
                //     }
                // },
                dropShadow: {
                    enabled: true,
                    color: '#000',
                    top: 18,
                    left: 7,
                    blur: 10,
                    opacity: 0.2
                },
                foreColor: '#bdc1c6',
                // theme: {
                //     mode: 'dark',
                //     palette: 'palette1',
                //     monochrome: {
                //         enabled: true,
                //         color: '#255aee',
                //         shadeTo: 'light',
                //         shadeIntensity: 0.65
                //     },
                // },
                tooltip: {
                    enabled: true
                },

            },
            // markers: {
            //     size: 1
            // },
            dataLabels: {
                enabled: false,
            },
            stroke: {
                show: true,
                curve: 'smooth',
                lineCap: 'butt',
                colors: ['#8ab4f8'],
                width: 2,
                dashArray: 0,
            },
            title: {
                text: 'Overview',
                align: 'left',
                style: {
                    fontSize: '14px',
                    fontWeight: 'bold',
                    color: '#8ab4f8'
                },
            },
            grid: {
                row: {
                    colors: ['#494B50', 'transparent'], // takes an array which will be repeated on columns
                    opacity: 0.5
                },
                xaxis: {
                    lines: {
                        show: false
                    }
                },
                yaxis: {
                    lines: {
                        show: false
                    }
                },
                // },
                // grid: {
                //     show: true,
                //     borderColor: '#90A4AE',
                //     strokeDashArray: 0,
                //     position: 'back',
                //     xaxis: {
                //         lines: {
                //             show: false
                //         }
                //     },
                //     yaxis: {
                //         lines: {
                //             show: false
                //         }
                //     },
                //     row: {
                //         colors: undefined,
                //         opacity: 0.5
                //     },
                //     column: {
                //         colors: undefined,
                //         opacity: 0.5
                //     },
                //     padding: {
                //         top: 0,
                //         right: 0,
                //         bottom: 0,
                //         left: 0
                //     },
            },
            xaxis: {
                categories,
                labels: {
                    rotate: 0,
                    show: true,
                },
            },
            yaxis: {
                show: true,
                // showAlways: false,
                // showForNullSeries: true,
                // seriesName: undefined,
                // opposite: false,
                // reversed: false,

                // logBase: 10,
                // tickAmount: undefined,
                // min: undefined,
                // max: undefined,
                // stepSize: undefined,
                // forceNiceScale: false,
                // floating: false,
                // decimalsInFloat: undefined,
                labels: {
                    formatter: function (val) {
                        return formatNumberAbbreviated(val);
                    },
                },
                // labels: {
                //     show: true,
                //     align: 'right',
                //     minWidth: 0,
                //     maxWidth: 160,
                //     style: {
                //         colors: [],
                //         fontSize: '12px',
                //         fontFamily: 'Helvetica, Arial, sans-serif',
                //         fontWeight: 400,
                //         cssClass: 'apexcharts-yaxis-label',
                //     },
                //     offsetX: 0,
                //     offsetY: 0,
                //     rotate: 0,
                // },
                // axisBorder: {
                //     show: true,
                //     color: '#78909C',
                //     offsetX: 0,
                //     offsetY: 0
                // },
                tickAmount: 9, // Adjust the number of ticks as needed
                max,   // Set the maximum value to control the y-axis range
                min,
                logarithmic: false,
                title: {
                    text: '-€',
                    rotate: -90,
                    offsetX: 0,
                    offsetY: 0,
                    style: {
                        cssClass: 'apexcharts-yaxis-title',
                    },
                },
                // crosshairs: {
                //     show: true,
                //     position: 'back',
                //     stroke: {
                //         color: '#b6b6b6',
                //         width: 1,
                //         dashArray: 0,
                //     },
                // },
            }
            // legend: {
            //     position: 'top',
            //     horizontalAlign: 'left',
            //     offsetX: 40,
            //     style: {
            //         fontSize: '12px',
            //         fontWeight: 500,
            //         cssClass: 'apexcharts-xaxis-label',
            //         fontFamily: 'Roboto, sans-serif',
            //         foreColor: '#000',
            //     },
            // },

        };
    }

    connectedCallback() {
        this.render();
    }

    render() {
        const chartContainer = document.createElement('div');
        this.appendChild(chartContainer);
        chartContainer.classList.add('chart-container')
        const chart = new ApexCharts(chartContainer, this.chartData);
        chart.render();
    }

}; customElements.define('custom-apex-chart', CHART);
