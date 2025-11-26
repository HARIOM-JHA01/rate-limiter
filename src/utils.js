export function defaultKeyExtractor(req) {
  if (req && req.ip) return req.ip;
  if (req && req.raw && req.raw.ip) return req.raw.ip;
  return 'global';
}
