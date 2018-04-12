export const Diff = function(a_, b_) {
    let a = a_;
    let b = b_;
    let m = a.length;
    let n = b.length;
    let reverse = false;
    let ed = null;
    let offset = m + 1;
    const path = [];
    const pathposi = [];
    const ses = [];
    let lcs = '';
    const SES_DELETE = -1;
    const SES_COMMON = 0;
    const SES_ADD = 1;
    let tmp1;
    let tmp2;

    const init = function() {
        if (m >= n) {
            tmp1 = a;
            tmp2 = m;
            a = b;
            b = tmp1;
            m = n;
            n = tmp2;
            reverse = true;
            offset = m + 1;
        }
    };

    const P = function(x, y, k) {
        return {
            x,
            y,
            k
        };
    };

    const seselem = function(elem, t) {
        return {
            elem,
            t
        };
    };

    const snake = function(k, p, pp) {
        let r;
        let x;
        let y;
        if (p > pp) {
            r = path[k - 1 + offset];
        } else {
            r = path[k + 1 + offset];
        }

        y = Math.max(p, pp);
        x = y - k;
        while (x < m && y < n && a[x] === b[y]) {
            ++x;
            ++y;
        }

        path[k + offset] = pathposi.length;
        pathposi[pathposi.length] = new P(x, y, r);
        return y;
    };

    const recordseq = function(epc) {
        let x_idx;
        let y_idx;
        let px_idx;
        let py_idx;
        let i;
        x_idx = y_idx = 1;
        px_idx = py_idx = 0;
        for (i = epc.length - 1; i >= 0; --i) {
            while (px_idx < epc[i].x || py_idx < epc[i].y) {
                if (epc[i].y - epc[i].x > py_idx - px_idx) {
                    if (reverse) {
                        ses[ses.length] = new seselem(b[py_idx], SES_DELETE);
                    } else {
                        ses[ses.length] = new seselem(b[py_idx], SES_ADD);
                    }
                    ++y_idx;
                    ++py_idx;
                } else if (epc[i].y - epc[i].x < py_idx - px_idx) {
                    if (reverse) {
                        ses[ses.length] = new seselem(a[px_idx], SES_ADD);
                    } else {
                        ses[ses.length] = new seselem(a[px_idx], SES_DELETE);
                    }
                    ++x_idx;
                    ++px_idx;
                } else {
                    ses[ses.length] = new seselem(a[px_idx], SES_COMMON);
                    lcs += a[px_idx];
                    ++x_idx;
                    ++y_idx;
                    ++px_idx;
                    ++py_idx;
                }
            }
        }
    };

    init();

    return {
        SES_DELETE: -1,
        SES_COMMON: 0,
        SES_ADD: 1,
        editdistance() {
            return ed;
        },
        getlcs() {
            return lcs;
        },
        getses() {
            return ses;
        },
        compose() {
            let p;
            let r;
            let i;
            let k;
            const delta = n - m;
            const size = m + n + 3;
            const fp = {};
            for (i = 0; i < size; ++i) {
                fp[i] = -1;
                path[i] = -1;
            }
            p = -1;
            do {
                ++p;
                for (k = -p; k <= delta - 1; ++k) {
                    fp[k + offset] = snake(k, fp[k - 1 + offset] + 1, fp[k + 1 + offset]);
                }
                for (k = delta + p; k >= delta + 1; --k) {
                    fp[k + offset] = snake(k, fp[k - 1 + offset] + 1, fp[k + 1 + offset]);
                }
                fp[delta + offset] = snake(delta, fp[delta - 1 + offset] + 1, fp[delta + 1 + offset]);
            } while (fp[delta + offset] !== n);

            ed = delta + 2 * p;

            r = path[delta + offset];

            const epc = [];
            while (r !== -1) {
                epc[epc.length] = new P(pathposi[r].x, pathposi[r].y, null);
                r = pathposi[r].k;
            }
            recordseq(epc);
        }
    };
};

export default Diff;
