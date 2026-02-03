import React from "react";
import ReactApexChart from "react-apexcharts";

const SpakChart1 = () => {

    const series = [{
        data: [23, 32, 27, 38, 27, 32, 27, 34, 26, 31, 28]
    }]
    const options = {
        chart: {
            type: 'line',
            width: 80,
            height: 35,
            sparkline: {
                enabled: true
            }
        },
        stroke: {
            width: [3],
            curve: 'smooth'
        },
        colors: ['#5664d2'],
    
        tooltip: {
            fixed: {
                enabled: false
            },
            x: {
                show: false
            },
            y: {
                title: {
                    formatter: function (seriesName) {
                        return ''
                    }
                }
            },
            marker: {
                show: false
            }
        }
    };

  return (
    <React.Fragment>
      <ReactApexChart options={options} series={series} type="line" height={35} width={80} />
    </React.Fragment>
  );
};

const SpakChart2 = () => {

    const series = [{
        data: [24, 62, 42, 84, 63, 25, 44, 46, 54, 28, 54]
    }]

    const options = {
        chart: {
            type: 'line',
            width: 80,
            height: 35,
            sparkline: {
                enabled: true
            }
        },
        stroke: {
            width: [3],
            curve: 'smooth'
        },
        colors: ['#5664d2'],
        tooltip: {
            fixed: {
                enabled: false
            },
            x: {
                show: false
            },
            y: {
                title: {
                    formatter: function (seriesName) {
                        return ''
                    }
                }
            },
            marker: {
                show: false
            }
        }
    };

  return (
    <React.Fragment>
      <ReactApexChart options={options} series={series} type="line" height={35} width={80} />
    </React.Fragment>
  );
};

const SpakChart3 = () => {

    const series = [{
        data: [42, 31, 42, 34, 46, 38, 44, 36, 42, 32, 54]
    }]

    const options = {
        chart: {
            type: 'line',
            width: 80,
            height: 35,
            sparkline: {
                enabled: true
            }
        },
        stroke: {
            width: [3],
            curve: 'smooth'
        },
        colors: ['#5664d2'],
        tooltip: {
            fixed: {
                enabled: false
            },
            x: {
                show: false
            },
            y: {
                title: {
                    formatter: function (seriesName) {
                        return ''
                    }
                }
            },
            marker: {
                show: false
            }
        }
    };

  return (
    <React.Fragment>
      <ReactApexChart options={options} series={series} type="line" height={35} width={80} />
    </React.Fragment>
  );
};

const RevenueAnalyticsChart = () => {

    const series = [{
        name: '2020',
        type: 'column',
        data: [23, 42, 35, 27, 43, 22, 17, 31, 22, 22, 12, 16]
    }, {
        name: '2019',
        type: 'line',
        data: [23, 32, 27, 38, 27, 32, 27, 38, 22, 31, 21, 16]
    }]

    const options = {
        chart: {
            toolbar: {
                show: false,
            }
        },
        stroke: {
            width: [0, 3],
            curve: 'smooth'
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '20%',
            },
        },
        dataLabels: {
            enabled: false,
        },

        legend: {
            show: false,
        },
        colors: ['#5664d2', '#1cbb8c'],
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    };

  return (
    <React.Fragment>
      <ReactApexChart options={options} series={series} type="line" height={280} />
    </React.Fragment>
  );
};


export { SpakChart1, SpakChart2, SpakChart3, RevenueAnalyticsChart }