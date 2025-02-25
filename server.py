from http.server import HTTPServer, SimpleHTTPRequestHandler

def run(server_class=HTTPServer, handler_class=SimpleHTTPRequestHandler):
    server_address = ('', 5173)
    httpd = server_class(server_address, handler_class)
    print('Servidor rodando em http://localhost:5173/')
    httpd.serve_forever()

if __name__ == '__main__':
    run()