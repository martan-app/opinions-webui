export function displayName(name: string) {
  if (!name) {
    return null
  }

  const names = name.split(' ')

  if (names.length) {
    const first = names[0]
    if (names[1]) {
      const inital = names[1].charAt(0)

      return `${first} ${inital}.`
    }

    return first
  }

  return null
}

// const name = 'talisson jose ferreira da trindade' // Try edit me
// const transformed = displayName(name)
// console.log(transformed)