{/* <div className="form-icon right">
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control form-control-icon"
                        id="iconrightInput"
                        style={{ backgroundColor: "rgb(248 245 224)" }}
                        placeholder="Search Products by name or Scan Barcode..."
                        value={searchTerm}
                        ref={searchInputRef}
                        autoFocus
                        onChange={handleSearch}
                        onKeyDown={handleSearch}
                      />
                      <span
                        className="input-group-text"
                        id="basic-addon2"
                        onClick={() => setProdcut(Prodcut === 0 ? 1 : 0)}
                      >
                        <div className="d-flex">
                          <div style={{ backgroundColor: "red" }}>
                                                                  {/* <i className="ri-barcode-line fs-4 mx-5"></i> */}
                          </div>{" "}
                          <button className="bg-primary text-white">+</button>
                        </div>
                      </span>
                    </div>

                    {searchTerm && (
                      <div className="popup" style={popupStyles}>
                        {searchResults.map((product) => (
                          <div
                            key={product.product_hsn_code}
                            className="popup-item"
                            style={popupItemStyles}
                            onClick={(e) => {
                              getProductMultiplePrices(product.product_id);
                            }}
                          >
                            {product.product_english_name} -{" "}
                            {product.product_hsn_code}
                          </div>
                        ))}
                      </div>
                    )}
                  </div> */}