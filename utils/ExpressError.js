class ExpressError extends Error {
  constructor(message, statusCode) {
    //uruchamia się przy wywołaniu new ExpressError(message, errorCode) i tworzy nowy obiekt z parametrami ustawionymi wewnątrz
    super(); //wez wszystkie parametry z konstruktora dla klasy Error, jako że chcemy roszerzyć klase o nasze parametry a nie tworzyć jej od zera
    this.message = message;
    this.statusCode = statusCode;
  }
}

module.exports = ExpressError;
