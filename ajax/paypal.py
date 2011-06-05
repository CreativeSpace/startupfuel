from django.http import HttpResponse
import urllib

class Endpoint:

    default_response_text = 'Nothing to see here'
    verify_url = "https://www.paypal.com/cgi-bin/webscr"

    def do_post(self, url, args):
        return urllib.urlopen(url, urllib.urlencode(args)).read()

    def verify(self, data):
        args = {
            'cmd': '_notify-validate',
        }
        args.update(data)
        return self.do_post(self.verify_url, args) == 'VERIFIED'

    def default_response(self):
        return HttpResponse(self.default_response_text)

    def __call__(self, request):
        r = None
        if request.method == 'POST':
            data = dict(request.POST.items())
            # We need to post that BACK to PayPal to confirm it
            if self.verify(data):
                r = self.process(data)
            else:
                r = self.process_invalid(data)
        if r:
            return r
        else:
            return self.default_response()

    def process(self, data):
        pass

    def process_invalid(self, data):
        pass
