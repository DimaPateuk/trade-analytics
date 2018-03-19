const iframe = document.querySelector('.iframe');

iframe.addEventListener('load', () => {
  setInterval(printPrice, 1000);
});


function printPrice () {
  const price = iframe.contentDocument.querySelector('.pin_text');

  console.log(price.innerHTML);
}
