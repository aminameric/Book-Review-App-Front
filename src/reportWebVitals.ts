import { CLSMetric, FCPMetric, FIDMetric, LCPMetric, TTFBMetric, onCLS, onFCP, onFID, onLCP, onTTFB } from 'web-vitals';

type MetricHandler = (metric: CLSMetric | FCPMetric | FIDMetric | LCPMetric | TTFBMetric) => void;

const reportWebVitals = (onPerfEntry?: MetricHandler) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    onCLS(onPerfEntry);
    onFID(onPerfEntry);
    onFCP(onPerfEntry);
    onLCP(onPerfEntry);
    onTTFB(onPerfEntry);
  }
};

export default reportWebVitals;
