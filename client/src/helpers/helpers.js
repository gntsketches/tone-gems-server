
// Log forumulas per wikipedia "cents"
//  n = 1200 * log2() * (b/a) // b = a * 2^(n/1200)
// const cents = 1200 * Math.log2(nextPitch / pitch)

// const pitches = [
//   261.63, 277.18, 293.66, 311.13,    329.63, 349.23, 369.99, 392.00,
//   415.30, 440.00, 466.16, 493.88,    523.25  ]

export function buildPitchSet(base, centsArr, shaded) {
  const pitchSet = []
  const multiples = [0.25, 0.5, 1, 2, 4, 8, 16]
  multiples.forEach((multiple => {
    centsArr.forEach((cents, i) => {
      const pitch = (base*multiple) * (2**(cents/1200))
      const isShaded = shaded.includes(i+1)
      const nextCents = i===centsArr.length-1 ? 1200 : centsArr[i+1]
      pitchSet.push({
        pitch:pitch,
        cents: cents,
        nextCents: nextCents,
        index: i,
        max: centsArr.length-1,
        shaded:isShaded
      })
    })
  }))

  // vertically resizable scroll... make sure top 'C' is always there // canvasHeight = octavePX * totalOctaves //   + i think: (octavePx * ((pitchSet[pitchSet.length-1].nextCents - pitchSet[pitchSet.length-1].cents) / 1200)) // pitchSet.push({
  //   pitch: (base*32) * (2**(centsArr[0]/1200)),
  //   cents: centsArr[0],
  //   nextCents: centsArr[1],
  //   index: 0,
  //   shaded: shaded.includes(1)
  // })
  return pitchSet
}
