describe("Adding the main template", function() {
  it("should add an H1 tag", function() {
    const header = document.getElementsByTagName("h1");
    expect(header.length).toBe(1);
  });
});