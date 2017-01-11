describe("Adding the page template", function() {
  it("should add an H2 tag", function() {
    const header = document.getElementsByTagName("h2");
    expect(header.length).toBe(1);
  });
});