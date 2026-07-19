export const recordNewSession = async () => {
  // Detect Device
  const ua = navigator.userAgent;
  let browser = "Unknown Browser";
  if (ua.includes("Chrome")) browser = "Chrome";
  else if (ua.includes("Firefox")) browser = "Firefox";
  else if (ua.includes("Safari") && !ua.includes("Chrome")) browser = "Safari";
  else if (ua.includes("Edge") || ua.includes("Edg/")) browser = "Edge";
  
  let os = "Unknown OS";
  if (ua.includes("Win")) os = "Windows";
  else if (ua.includes("Mac")) os = "MacOS";
  else if (ua.includes("Linux")) os = "Linux";
  else if (ua.includes("Android")) os = "Android";
  else if (ua.includes("like Mac")) os = "iOS";
  const deviceName = `${os} Device ${browser}`;

  // Generate Time
  const now = new Date();
  const pad = n => n.toString().padStart(2, '0');
  let h = now.getHours();
  const min = now.getMinutes();
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12; h = h || 12;
  const loginTime = `${pad(now.getDate())}-${pad(now.getMonth() + 1)}-${now.getFullYear()} ${pad(h)}:${pad(min)} ${ampm}`;

  // Fetch Location
  let locationName = 'Unknown Location';
  try {
    // Attempt 1: ipwho.is (very reliable, full country names)
    const res1 = await fetch('https://ipwho.is/');
    const data1 = await res1.json();
    if (data1.success && data1.city) {
      locationName = `${data1.city}, ${data1.country}`.replace(/^, |, $/g, '');
    } else {
      throw new Error("ipwho.is failed");
    }
  } catch (err1) {
    try {
      // Attempt 2: ipapi.co
      const res2 = await fetch('https://ipapi.co/json/');
      const data2 = await res2.json();
      if (data2.city) {
        locationName = `${data2.city}, ${data2.country_name}`.replace(/^, |, $/g, '');
      } else {
        throw new Error("ipapi failed");
      }
    } catch (err2) {
      try {
        // Attempt 3: get.geojs.io
        const res3 = await fetch('https://get.geojs.io/v1/ip/geo.json');
        const data3 = await res3.json();
        if (data3.city) {
          locationName = `${data3.city}, ${data3.country}`.replace(/^, |, $/g, '');
        } else {
          throw new Error("geojs failed");
        }
      } catch (err3) {
        // Final Browser Fallback (e.g., "Asia/Kolkata" -> "Kolkata")
        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        locationName = timeZone ? timeZone.split('/')[1]?.replace('_', ' ') : 'Unknown Location';
      }
    }
  }

  const newSession = {
    id: Date.now().toString(),
    device: deviceName,
    active: true,
    location: locationName || 'Unknown Location',
    loginTime: loginTime,
    isCurrent: true
  };

  const existing = JSON.parse(localStorage.getItem('active_sessions') || '[]');
  // Mark all existing as not current
  const updated = existing.map(s => ({ ...s, isCurrent: false }));
  updated.unshift(newSession);

  localStorage.setItem('active_sessions', JSON.stringify(updated));
  localStorage.setItem('current_session_id', newSession.id);
};
