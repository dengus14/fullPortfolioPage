let ctx: AudioContext | null = null;

export function playClick(volume = 0.4) {
  if (!ctx) ctx = new AudioContext();
  const t = ctx.currentTime;

  // body: short low thump to simulate the mechanism mass
  const body = ctx.createOscillator();
  body.type = "sine";
  body.frequency.setValueAtTime(120, t);
  body.frequency.exponentialRampToValueAtTime(40, t + 0.025);

  const bodyGain = ctx.createGain();
  bodyGain.gain.setValueAtTime(volume * 0.6, t);
  bodyGain.gain.exponentialRampToValueAtTime(0.001, t + 0.025);

  body.connect(bodyGain);
  bodyGain.connect(ctx.destination);
  body.start(t);
  body.stop(t + 0.025);

  // snap: bandpass-filtered noise burst for the click transient
  const bufLen = Math.floor(ctx.sampleRate * 0.02);
  const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < bufLen; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufLen, 4);
  }

  const snap = ctx.createBufferSource();
  snap.buffer = buf;

  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = 2200;
  filter.Q.value = 0.8;

  const snapGain = ctx.createGain();
  snapGain.gain.setValueAtTime(volume * 0.5, t);
  snapGain.gain.exponentialRampToValueAtTime(0.001, t + 0.02);

  snap.connect(filter);
  filter.connect(snapGain);
  snapGain.connect(ctx.destination);
  snap.start(t);
}
