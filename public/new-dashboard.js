'use strict';
var realtime = 'on';

function initSparkline() {
  $('.sparkline').each(function() {
    var $this = $(this);
    $this.sparkline('html', $this.data());
  });
}

function initDonutChart() {
  'use strict';
  Morris.Donut({
    element: 'donut_chart',
    data: [
      {
        label: 'Chrome',
        value: 37
      },
      {
        label: 'Firefox',
        value: 30
      },
      {
        label: 'Safari',
        value: 18
      },
      {
        label: 'Opera',
        value: 12
      },
      {
        label: 'Other',
        value: 3
      }
    ],
    colors: [
      'rgb(233, 30, 99)',
      'rgb(0, 188, 212)',
      'rgb(255, 152, 0)',
      'rgb(0, 150, 136)',
      'rgb(96, 125, 139)'
    ],
    formatter: function(y) {
      return y + '%';
    }
  });
}

('use strict');
$(function() {
  drawGraphForSATAVG();
  getAdmitRate();
  getRetentionRate();
  getGPAScore();
});

function drawGraphForSATAVG() {
  $.ajax({
    url: 'index/sat',
    dataType: 'json',
    success: function(results) {
      //console.log('results:' + JSON.stringify(results));
      let datas = [];
      results.forEach(result => {
        if (
          datas.length > 0 &&
          datas.filter(data => data.year === result['YEAR']).length > 0
        ) {
          name = result['INSTNM'];
          datas.forEach((data, index) => {
            if (data.year === result['YEAR']) {
              data[name] = parseInt(result['SAT_AVG']);
            }
          });
        } else {
          name = result['INSTNM'];
          let tempObj = {};
          tempObj['year'] = result['YEAR'];
          tempObj[name] = parseInt(result['SAT_AVG']);
          datas.push(tempObj);
        }
      });
      datas = datas.filter(data => data.year);
      console.log('Processed data range lists:' + JSON.stringify(datas));
      // for chronological ordering
      datas.sort((a, b) =>
        a['year'] > b['year'] ? 1 : b['year'] > a['year'] ? -1 : 0
      );
      let labels = [];
      let ucbData = [];
      let ucdData = [];
      let uciData = [];
      let uclaData = [];
      let ucrData = [];
      let ucsdData = [];
      let ucsbData = [];
      let ucscData = [];
      let ucmData = [];

      datas.forEach(data => {
        labels.push(data['year']);
        ucbData.push(data['University of California-Berkeley']);
        ucdData.push(data['University of California-Davis']);
        uciData.push(data['University of California-Irvine']);
        uclaData.push(data['University of California-Los Angeles']);
        ucrData.push(data['University of California-Riverside']);
        ucsdData.push(data['University of California-San Diego']);
        ucsbData.push(data['University of California-Santa Barbara']);
        ucscData.push(data['University of California-Santa Cruz']);
        ucmData.push(data['University of California-Merced']);
      });

      let data = {
        labels: labels,
        datasets: [
          {
            label: 'UCB',
            data: ucbData,
            backgroundColor: '#dd5e89'
          },
          {
            label: 'UCD',
            data: ucdData,
            backgroundColor: '#f7bb97'
          },
          {
            label: 'UCI',
            data: uciData,
            backgroundColor: '#c6ca97'
          },
          {
            label: 'UCLA',
            data: uclaData,
            backgroundColor: '#d6ae57'
          },
          {
            label: 'UCR',
            data: ucrData,
            backgroundColor: '#a56b34'
          },
          {
            label: 'UCSD',
            data: ucsdData,
            backgroundColor: '#fb65a8'
          },
          {
            label: 'UCSC',
            data: ucscData,
            backgroundColor: '#a4b678'
          },
          {
            label: 'UCSB',
            data: ucsbData,
            backgroundColor: '#dd5e89'
          },
          {
            label: 'UCM',
            data: ucmData,
            backgroundColor: '#b5c567'
          }
        ]
      };

      let config = {
        type: 'bar',
        data: data,
        options: {
          responsive: true,
          legend: {
            display: false
          },
          scales: {
            xAxes: [
              {
                scaleLabel: {
                  display: true,
                  labelString: 'YEAR',
                  fontSize: 16
                }
              }
            ],
            yAxes: [
              {
                scaleLabel: {
                  display: true,
                  labelString: 'AVG_SAT',
                  fontSize: 16
                }
              }
            ]
          }
        }
      };

      new Chart(document.getElementById('bar_chart1').getContext('2d'), config);

      console.log('labels:', labels);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      alert('error ' + textStatus + ' ' + errorThrown);
    }
  });
}

function getAdmitRate() {
  // get the rangeResults
  $.ajax({
    url: '/recentdash/admitrate',
    dataType: 'json',

    success: function(results) {
      console.log(JSON.stringify(results));
      let labels = [];
      let admitRates = [];

      results.forEach(result => {
        labels.push(result['INSTNM']);
        admitRates.push(result['ADM_RATE']);
      });

      let data = {
        labels: [
          'UCB',
          'UCD',
          'UCI',
          'UCLA',
          'UCR',
          'UCSD',
          'UCSB',
          'UCSC',
          'UCM'
        ],
        datasets: [
          {
            label: '2017',
            data: admitRates,
            backgroundColor: '#F0AFC3'
          }
        ]
      };

      let config = {
        type: 'horizontalBar',
        data: data,
        options: {
          responsive: true,
          legend: false,
          scales: {
            xAxes: [
              {
                scaleLabel: {
                  display: true,
                  labelString: 'YEAR',
                  fontSize: 16
                }
              }
            ],
            yAxes: [
              {
                scaleLabel: {
                  display: true,
                  labelString: 'SAT',
                  fontSize: 16
                }
              }
            ]
          }
        }
      };
      new Chart(
        document.getElementById('line_chart1').getContext('2d'),
        config
      );
    },
    error: function(jqXHR, textStatus, errorThrown) {
      alert('error ' + textStatus + ' ' + errorThrown);
    }
  });
}

function getRetentionRate() {
  $.ajax({
    url: '/recentdash/retentionrate',
    dataType: 'json',

    success: function(results) {
      console.log('In RetentionRate:', JSON.stringify(results));
      let retentionRates = [];
      results.forEach(result => {
        retentionRates.push(result['RET_FT4']);
      });

      let data = {
        labels: [
          'UCB',
          'UCD',
          'UCI',
          'UCLA',
          'UCR',
          'UCSD',
          'UCSB',
          'UCSC',
          'UCM'
        ],
        datasets: [
          {
            label: '2017',
            data: retentionRates,
            backgroundColor: '#80D6E5'
          }
        ]
      };

      let config = {
        type: 'bar',
        data: data,
        options: {
          responsive: true,
          legend: false,
          scales: {
            xAxes: [
              {
                scaleLabel: {
                  display: true,
                  labelString: 'YEAR',
                  fontSize: 16
                }
              }
            ],
            yAxes: [
              {
                scaleLabel: {
                  display: true,
                  labelString: 'DEBT',
                  fontSize: 16
                }
              }
            ]
          }
        }
      };
      new Chart(
        document.getElementById('line_chart2').getContext('2d'),
        config
      );
    },
    error: function(jqXHR, textStatus, errorThrown) {
      alert('error ' + textStatus + ' ' + errorThrown);
    }
  });
}

function getGPAScore() {
  // get the earningsResults
  $.ajax({
    url: '/recentdash/gpa',
    dataType: 'json',

    success: function(results) {
      console.log('In GPA Score:', JSON.stringify(results));
      let gpaScores = [];
      results.forEach(result => {
        gpaScores.push(result['GPA_Val']);
      });

      let data = {
        labels: [
          'UCB',
          'UCD',
          'UCI',
          'UCLA',
          'UCR',
          'UCSD',
          'UCSB',
          'UCSC',
          'UCM'
        ],
        datasets: [
          {
            label: '2017',
            data: gpaScores,
            backgroundColor: '#BAC89A'
          }
        ]
      };

      let config = {
        type: 'horizontalBar',
        data: data,
        options: {
          responsive: true,
          legend: false,
          scales: {
            xAxes: [
              {
                scaleLabel: {
                  display: true,
                  labelString: 'YEAR',
                  fontSize: 16
                }
              }
            ],
            yAxes: [
              {
                scaleLabel: {
                  display: true,
                  labelString: 'Mean Earnings',
                  fontSize: 16
                }
              }
            ]
          }
        }
      };
      new Chart(
        document.getElementById('line_chart3').getContext('2d'),
        config
      );
    },
    error: function(jqXHR, textStatus, errorThrown) {
      alert('error ' + textStatus + ' ' + errorThrown);
    }
  });
}

// function getDiversityResults(filterValue) {
//   // get the diversityResults
//   $.ajax({
//     url: 'index/diversity',
//     dataType: 'json',

//     success: function(results) {
//       //$("#test").append(data);
//       // d=JSON.stringify(data)

//       console.log('received diversity data', results);
//       let datas = [];
//       results
//         .filter(
//           result => result['INSTNM'].toLowerCase() === filterValue.toLowerCase()
//         )
//         .forEach(result => {
//           let tempObj = {};
//           tempObj['2mor'] = parseFloat(result['UGDS_2MOR']);
//           tempObj['aian'] = parseFloat(result['UGDS_AIAN']);
//           tempObj['asian'] = parseFloat(result['UGDS_ASIAN']);
//           tempObj['black'] = parseFloat(result['UGDS_BLACK']);
//           tempObj['hisp'] = parseFloat(result['UGDS_HISP']);
//           tempObj['nhpi'] = parseFloat(result['UGDS_NHPI']);
//           tempObj['nra'] = parseFloat(result['UGDS_NRA']);
//           tempObj['unkn'] = parseFloat(result['UGDS_UNKN']);
//           tempObj['white'] = parseFloat(result['UGDS_WHITE']);
//           tempObj['year'] = parseFloat(result['YEAR']);
//           datas.push(tempObj);
//         });

//       console.log('Processed diversity results', JSON.stringify(datas));
//       datas.sort((a, b) =>
//         a['year'] > b['year'] ? 1 : b['year'] > a['year'] ? -1 : 0
//       );

//       let labels = [];
//       let twoOrMore = [];
//       let americanIndian = [];
//       let asian = [];
//       let black = [];
//       let hisp = [];
//       let nativeHawaiian = [];
//       let nonResidentAlien = [];
//       let unknown = [];
//       let white = [];

//       datas.forEach(data => {
//         labels.push(data['year']);
//         twoOrMore.push(data['2mor']);
//         americanIndian.push(data['aian']);
//         asian.push(data['asian']);
//         black.push(data['black']);
//         hisp.push(data['hisp']);
//         nativeHawaiian.push(data['nhpi']);
//         nonResidentAlien.push(data['nra']);
//         unknown.push(data['unkn']);
//         white.push(data['white']);
//       });

//       let data = {
//         labels: labels,
//         datasets: [
//           {
//             label: 'Two Or More',
//             data: twoOrMore,
//             backgroundColor: '#292B2C'
//           },
//           {
//             label: 'American Indian',
//             data: americanIndian,
//             backgroundColor: '#5BC0DD'
//           },
//           {
//             label: 'Asian',
//             data: asian,
//             backgroundColor: '#5CB85D'
//           },
//           {
//             label: 'Black',
//             data: black,
//             backgroundColor: '#0076D8'
//           },
//           {
//             label: 'Hispanic',
//             data: hisp,
//             backgroundColor: '#545B62'
//           },
//           {
//             label: 'Native Hawaiian',
//             data: nativeHawaiian,
//             backgroundColor: '#D9534F'
//           },
//           {
//             label: 'Non Resident Alien',
//             data: nonResidentAlien,
//             backgroundColor: '#EFAD4E'
//           },
//           {
//             label: 'Unknown',
//             data: unknown,
//             backgroundColor: '#8C5EDD'
//           },
//           {
//             label: 'white',
//             data: white,
//             backgroundColor: '#C87000'
//           }
//         ]
//       };

//       let config = {
//         type: 'bar',
//         data: data,
//         options: {
//           responsive: true,
//           legend: false
//         }
//       };

//       new Chart(document.getElementById('bar_chart2').getContext('2d'), config);
//     },
//     error: function(jqXHR, textStatus, errorThrown) {
//       alert('error ' + textStatus + ' ' + errorThrown);
//     }
//   });
// }

function getChartJs(type) {
  let config = null;

  if (type === 'line') {
    config = {
      type: 'line',
      data: {
        labels: [
          'January',
          'February',
          'March',
          'April',
          'May',
          'June',
          'July'
        ],
        datasets: [
          {
            label: 'My First dataset',
            data: [66, 59, 80, 72, 56, 55, 54],
            borderColor: 'rgba(0, 188, 212, 0.75)',
            backgroundColor: 'rgba(0, 188, 212, 0.3)',
            pointBorderColor: 'rgba(0, 188, 212, 0)',
            pointBackgroundColor: 'rgba(0, 188, 212, 0.9)',
            pointBorderWidth: 1
          },
          {
            label: 'My Second dataset',
            data: [28, 48, 40, 32, 80, 50, 89],
            borderColor: 'rgba(233, 30, 99, 0.75)',
            backgroundColor: 'rgba(233, 30, 99, 0.3)',
            pointBorderColor: 'rgba(233, 30, 99, 0)',
            pointBackgroundColor: 'rgba(233, 30, 99, 0.9)',
            pointBorderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        legend: false
      }
    };
  } else if (type === 'bar') {
    config = {
      type: 'bar',
      data: {
        labels: [
          'January',
          'February',
          'March',
          'April',
          'May',
          'June',
          'July'
        ],
        datasets: [
          {
            label: 'My First dataset',
            data: [55, 69, 70, 81, 56, 55, 82],
            backgroundColor: '#dd5e89'
          },
          {
            label: 'My Second dataset',
            data: [28, 48, 51, 19, 86, 32, 81],
            backgroundColor: '#f7bb97'
          },
          {
            label: 'My Third dataset',
            data: [32, 54, 62, 78, 47, 43, 75],
            backgroundColor: '#c6ca97'
          }
        ]
      },
      options: {
        responsive: true,
        legend: false
      }
    };
  }

  return config;
}