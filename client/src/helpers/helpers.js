/* eslint-disable */


// Log forumulas per wikipedia "cents"
//  n = 1200 * log2() * (b/a) // b = a * 2^(n/1200)
// const cents = 1200 * Math.log2(nextPitch / pitch)

// const pitches = [
//   261.63, 277.18, 293.66, 311.13,    329.63, 349.23, 369.99, 392.00,
//   415.30, 440.00, 466.16, 493.88,    523.25  ]

const pitchData = [
    {cents:0,    color: '#aaa', name: 'C' },
    {cents:75,   color: '#99a', name: 'c#'},
    {cents:200,  color: '#aaa', name: 'D' },
    {cents:250,  color: '#99a', name: 'd#'},
    {cents:400,  color: '#aaa', name: 'E' },
    {cents:500,  color: '#aaa', name: 'F' },
    {cents:600,  color: '#99a', name: 'F#'},
    {cents:700,  color: '#aaa', name: 'G' },
    {cents:800,  color: '#99a', name: 'G#'},
    {cents:850,  color: '#aaa', name: 'a' },
    {cents:1000, color: '#99a', name: 'A#'},
    {cents:1100, color: '#aaa', name: 'B' },
  ]

export function buildPitchSet(base, pitchData) {
  const pitchSet = []
  const multiples = [0.25, 0.5, 1, 2, 4, 8, 16]
  multiples.forEach((multiple, i) => {
    pitchData.forEach((pitchObj, j) => {
      const pitch = (base*multiple) * (2**(pitchObj.cents/1200))
      const nextCents = j===pitchData.length-1 ? 1200 : pitchData[j+1].cents
      const totalCents = (i*1200) + pitchObj.cents
      const totalCentsNext = (i*1200) + nextCents
      pitchSet.push({
        color: pitchObj.color,
        name: pitchObj.name,
        cents: pitchObj.cents,
        pitch,
        nextCents,
        totalCents,
        totalCentsNext,
        index: j,
        max: pitchData.length-1,
      })
    })
  })

  // vertically resizable scroll... make sure top 'C' is always there // canvasHeight = octavePX * totalOctaves //   + i think: (octavePx * ((pitchSet[pitchSet.length-1].nextCents - pitchSet[pitchSet.length-1].cents) / 1200)) // pitchSet.push({
  //   pitch: (base*32) * (2**(centsArr[0]/1200)),
  //   cents: centsArr[0],
  //   nextCents: centsArr[1],
  //   index: 0,
  //   shaded: shaded.includes(1)
  // })
  return pitchSet
}

const pitchSet = buildPitchSet(261.63, pitchData)
// console.log('new pitchSet', pitchSet)



export function bundleComposition(state) {
  console.log('bc state', state)
  return JSON.stringify({
    title: state.title,
    notes: state.notes,
    octavePx: state.octavePx,
    scrollTop: state.scrollTop,
  });

}


//
// export function buildPitchSet(base, centsArr, shaded) {
//   const pitchSet = []
//   const multiples = [0.25, 0.5, 1, 2, 4, 8, 16]
//   multiples.forEach((multiple, i) => {
//     centsArr.forEach((cents, j) => {
//       const pitch = (base*multiple) * (2**(cents/1200))
//       const isShaded = shaded.includes(j+1)
//       const nextCents = j===centsArr.length-1 ? 1200 : centsArr[j+1]
//       const totalCents = (i*1200) + cents
//       const totalCentsNext = (i*1200) + nextCents
//       pitchSet.push({
//         pitch,
//         cents,
//         nextCents,
//         totalCents,
//         totalCentsNext,
//         index: i,
//         max: centsArr.length-1,
//         shaded:isShaded
//       })
//     })
//   })
//
//   // vertically resizable scroll... make sure top 'C' is always there // canvasHeight = octavePX * totalOctaves //   + i think: (octavePx * ((pitchSet[pitchSet.length-1].nextCents - pitchSet[pitchSet.length-1].cents) / 1200)) // pitchSet.push({
//   //   pitch: (base*32) * (2**(centsArr[0]/1200)),
//   //   cents: centsArr[0],
//   //   nextCents: centsArr[1],
//   //   index: 0,
//   //   shaded: shaded.includes(1)
//   // })
//   return pitchSet
// }
