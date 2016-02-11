const toString = Object.prototype.toString

// 返回vue匹配的props的对象
// 此函数用来强制props验证
export function defaultProps (props) {
  for (const i in props) {
    if (props.hasOwnProperty(i)) {
      let defaultValue = props[i]

      // 支持String， Number等类型
      // String Number Boolean Function Object Array
      /**
       * Here goes:
       *  defaultProps({
       *    date: String,
       *    onclick: () => {}
       *  })
       *  defaultValue.name = String/Function (This is string type)
       *  So . window[defaultValue.name] is the constructor of basic type
       */
    
      if (defaultValue && defaultValue.name && window[defaultValue.name] === defaultValue) {
        props[i] = {
          type: defaultValue,
          default: null
        }
        continue
      }

      let type = toString.call(defaultValue).replace('[object ', '').replace(']', '')

      // 如果传进来的是vue的原生props对象的话
      if (type === 'Object') {
        if (defaultValue.type != null ||
            defaultValue.default != null ||
            defaultValue.validator != null ||
            defaultValue.twoWay != null ||
            defaultValue.required != null) {
          continue
        }
      }

      // 支持 Object和Array的简洁声明方式
      // Todo: 目前看来这样并没有什么卵用
      if (type === 'Array' || type === 'Object') {
        props[i] = {
          type: window[type],
          default: function () {
            return defaultValue
          }
        }
      }

      props[i] = {
        type: window[type],
        default: defaultValue
      }
    }
  }

  return props
}

export function oneOfType (validList, defaultValue) {
  let validaObj = {}

  validaObj.default = defaultValue
  validaObj.validator = function (value) {
    if (value == null) return true

    for (let j = 0; j < validList.length; j++) {
      const currentValid = validList[j]
      let validName
      if (typeof currentValid === 'string') {
        validName = currentValid
      } else {
        validName = currentValid.name
      }
      if (toString.call(value).indexOf(validName) > -1) {
        return true
      }
    }
    return false
  }

  return validaObj
}

export function oneOf (validList, defaultValue) {
  let validaObj = {}

  validaObj.default = defaultValue
  validaObj.validator = function (value) {
    if (value == null) return true

    for (let j = 0; j < validList.length; j++) {
      if (value === validList[j]) {
        return true
      }
    }
    return false
  }

  return validaObj
}

export const any = {
  validator: function (value) {
    return true
  }
}
