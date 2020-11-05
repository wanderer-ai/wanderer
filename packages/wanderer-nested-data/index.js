
class WandererNestedData {

  constructor (data) {

    if(data === undefined) {
      data = {}
    }
    this.data = data
  }

	objectifier (splits, context) {
		var result = context
		for(var i = 0, s; result && (s = splits[i]); i++) {
			result = (s in result ? result[s] : undefined)
		}
		return result;
	}

  plain () {
    return this.data
  }

	set (name, value) {
    if(value instanceof WandererNestedData) {
      value = value.data
    }
		var splits = name.split('.'), s = splits.pop(), result = this.objectifier(splits, this.data)
		return result && s ? (result[s] = value) : undefined
	}

	get (name) {
    var result = this.objectifier(name.split('.'), this.data)
    if(typeof result === 'object' && result !== null) {
      return new WandererNestedData(result)
    }
		return result
	}

  has (name) {
    return this.get(name, false) !== undefined
  }

  with (name, method) {
    if(this.get(name, false) !== undefined) {
      method(this.get(name, false))
    }
  }

  each (method) {
    for (var key in this.data) {
      if(this.data.hasOwnProperty(key)) {
        method(this.get(key))
      }
    }
  }

}

module.exports = WandererNestedData
