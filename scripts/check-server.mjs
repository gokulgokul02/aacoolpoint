async function check() {
  try {
    const res = await fetch('http://localhost:5173');
    console.log('HTTP Status:', res.status);
    const html = await res.text();
    console.log('HTML preview:\n', html);

    const cssRes = await fetch('http://localhost:5173/src/index.css');
    console.log('CSS Status:', cssRes.status, 'Content-Type:', cssRes.headers.get('content-type'));
    const cssText = await cssRes.text();
    console.log('CSS preview (first 300 chars):', cssText.slice(0, 300));
    console.log('CSS preview (last 300 chars):', cssText.slice(-300));
    console.log('Total CSS length:', cssText.length);
  } catch (err) {
    console.error('Error fetching:', err);
  }
}
check();

