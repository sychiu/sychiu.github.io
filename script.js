$(document).ready(function () {


    var palettes = [
    ['#8B8A94'],
    ['#595D6D'],
    ['#256391'],
    ['#8FC03B'],
      ['#DBC695'],
      ['#A1B75E'],
      ['#A15C3E'],
      ['#9684AF'],
      ['#232329'],
      ['#d15e62'],
      ['#F5B46B'],
      ['#E26A89'],
      ['#782888'],
      ['#778f55'],
      ['#D19358'],
      ['#5E866A'],
      ['#EE9A3A'],
      ['#A1C485'],
      ['#105578'],
      ['#484B80'],
      ['#376C80'],
      ['#8DC0B6'],
      ['#6F6360'],
      ['#528663'],
      ['#8F983F'],
      ['#D0A83F'],
      ['#142B5A'],
      ['#327293'],
      ['#84a85d'],
      ['#aac785'],
      ['#D26A10'],
      ['#8DA581'],
      ['#F1AA84'],
      ['#827F40'],
      ['#D88F55'],
      ['#4C606D'],
      ['#67A281'],
      ['#1254A4'],
      ['#CD6C71'],
      ['#97A97D'],
      ['#D58A8B'],
      ['#6688B2'],
      ['#20315D'],
      ['#7498c2'],
      ['#0f62fe']
  ];
    var randomPalette = palettes[Math.floor(Math.random() * palettes.length)];

    var new_bgcolor = randomPalette[0];

    $('.line').css({
        'border-color': new_bgcolor
    });
});
