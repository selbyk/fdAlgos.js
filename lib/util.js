/**
 * Extentions to Native Node Objects
 *
 */

// attach the .equals method to Array's prototype to call it on any array
Array.prototype.equals = function(array) {
  // if the other array is a falsy value, return
  if (!array)
    return false;
  // compare lengths - can save a lot of time
  if (this.length !== array.length)
    return false;
  for (var i = 0, l = this.length; i < l; i++) { // Check if we have nested arrays
    if (this[i] instanceof Array && array[i] instanceof Array) { // recurse into the nested arrays
      if (!this[i].equals(array[i]))
        return false;
    } else if (this[i] !== array[i]) { // Warning - two different object instances will never be equal: {x:20} != {x:20}
      return false;
    }
  }
  return true;
};

// attach the .equals method to Array's prototype to call it on any array
Array.prototype.proper_subset = function(array) {
  // if the other array is a falsy value, return
  if (!array)
    return false;
  // compare lengths - can save a lot of time
  if (array.length >= this.length)
    return false;
  for (var i = 0; i < array.length; ++i) {
    if (this.indexOf(array[i]) === -1) {
      return false;
    }
  }
  return true;
};

// attach the .equals method to Array's prototype to call it on any array
Array.prototype.subset = function(array) {
  // if the other array is a falsy value, return
  if (!array) return false;
  // compare lengths - can save a lot of time
  if (array.length > this.length) return false;
  for (var i = 0; i < array.length; ++i) {
    if (this.indexOf(array[i]) === -1) {
      return false;
    }
  }
  return true;
};

// attach the .equals method to Array's prototype to call it on any array
Array.prototype.is_subset_of = function(array) {
  // if the other array is a falsy value, return
  if (!array) return false;
  // compare lengths - can save a lot of time
  if (this.length > array.length) return false;
  for (var i = 0; i < this.length; ++i) {
    if (array.indexOf(this[i]) === -1) {
      return false;
    }
  }
  return true;
};

// attach the .equals method to Array's prototype to call it on any array
Array.prototype.includes_fd = function(element) {
  // if the other array is a falsy value, return
  if (!element)
    return false;
  // compare lengths - can save a lot of time
  if (element instanceof Array) {
    for (var i = 0; i < this.length; ++i) {
      if (this[i] instanceof Array && this[i][0].equals(element[0]) && element[1].is_subset_of(this[i][1])) {
        return true;
      }
    }
  }
  return false;
};

// attach the .equals method to Array's prototype to call it on any array
Array.prototype.merge = function(that) {
  var thisthat = [].concat(this);
  that.forEach(function(element) {
    if (thisthat.indexOf(element) === -1)
      thisthat.push(element);
  });
  return thisthat;
};
