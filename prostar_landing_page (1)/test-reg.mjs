async function testReg() {
  console.log("🧪 Teste mit neuem Server (Port 3002)...\n");

  const response = await fetch(
    "http://localhost:3002/api/trpc/course.register",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        json: {
          name: "Jonas Friedrich",
          email: "jonfriedrichspsm@gmail.com",
          courseName: "free-mini-course",
        },
      }),
    }
  );

  const result = await response.json();
  console.log(JSON.stringify(result, null, 2));
}

testReg();
