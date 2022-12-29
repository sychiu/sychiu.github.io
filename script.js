$(document).ready(function() {
    
    
  var palettes = [
    ['#A4A389'],
    ['#A29496'],
    ['#8B8A94'],
    ['#595D6D'],
    ['#5B9195'],
    ['#256391'],
    ['#8FC03B'],
      ['#CDDEAC'],
      ['#DBC695'],
      ['#A1B75E'],
      ['#A15C3E'],
      ['#9684AF'],
      ['#232329'],
      ['#EF4F54'],
      ['#363448'],
      ['#F5B46B'],
      ['#E26A89'],
      ['#782888'],
      ['#778f55'],
      ['#D19358'],
      ['#5E866A'],
      ['#DFC185'],
      ['#EE9A3A'],
      ['#A1C485'],
      ['#105578'],
      ['#484B80'],
      ['#2A9642'],
      ['#376C80'],
      ['#F2F0C4'],
      ['#8DC0B6'],
      ['#6F6360'],
      ['#528663'],
      ['#8F983F'],
      ['#D0A83F'],
      ['#142B5A'],
      ['#327293'],
  ];
  var randomPalette = palettes[Math.floor(Math.random() * palettes.length)];
  
  var new_bgcolor = randomPalette[0];

  $('.line').css({
    'border-color': new_bgcolor
  });
});