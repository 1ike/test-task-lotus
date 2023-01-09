export default () => ({
  PORT: parseInt(process.env.NX_SERVER_PORT, 10) || 3333,
  TIMER: parseInt(process.env.NX_TIMER, 10) || 120,
});
